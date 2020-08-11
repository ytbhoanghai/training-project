package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.exception.CartNotFoundException;
import com.example.demo.exception.NotEnoughQuantityException;
import com.example.demo.form.CartItemUpdateForm;
import com.example.demo.form.PaymentForm;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.response.CartItemResponse;
import com.example.demo.response.CartResponse;
import com.example.demo.response.PageableProductResponse;
import com.example.demo.response.ProductResponse;
import com.example.demo.security.SecurityUtil;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service(value = "customerService")
public class CustomerServiceImpl implements CustomerService {

    @Value("${stripe.secret.key}")
    private String stripe_api_key;

    private SecurityUtil securityUtil;
    private CartRepository cartRepository;
    private CartItemRepository cartItemRepository;
    private OrderRepository orderRepository;
    private OrderItemRepository orderItemRepository;

    private ProductService productService;
    private StoreService storeService;
    private CategoryService categoryService;
    private StoreProductService storeProductService;

    @Autowired
    public CustomerServiceImpl(SecurityUtil securityUtil,
                               CartRepository cartRepository,
                               CartItemRepository cartItemRepository,
                               OrderRepository orderRepository,
                               OrderItemRepository orderItemRepository,
                               ProductService productService,
                               StoreService storeService,
                               CategoryService categoryService,
                               StoreProductService storeProductService) {

        this.securityUtil           = securityUtil;
        this.cartRepository         = cartRepository;
        this.cartItemRepository     = cartItemRepository;
        this.orderRepository        = orderRepository;
        this.orderItemRepository    = orderItemRepository;

        this.productService         = productService;
        this.storeService           = storeService;
        this.categoryService        = categoryService;
        this.storeProductService    = storeProductService;
    }

    @Override
    public CartResponse getMyCart() {
        Cart cart = getCartByCurrentStaff();
        if (cart != null) {
            List<CartItem> cartItems = cartItemRepository.findAllByCart(cart);
            return CartResponse.build(cart, cartItems);
        }

        Staff staff = securityUtil.getCurrentStaff();
        cart = cartRepository.save(new Cart(null, staff, new Date()));
        return CartResponse.build(cart, Collections.emptyList());
    }

    @Override
    public CartItemResponse addCartItem(Integer productId, Integer quantity) {
        Cart cart = getCartByCurrentStaff();
        Product product = productService.findById(productId);

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(new CartItem(null, cart, product, 0, new Date()));

        if (cartItem.getQuantity() + quantity > product.getQuantity()) {
            throw new NotEnoughQuantityException("not enough quantity !!!");
        }

        cartItem.setQuantity(cartItem.getQuantity() + quantity);
        return CartItemResponse.build(cartItemRepository.save(cartItem));
    }

    @Override
    public void removeCartItem(Integer idCartItem) {
        Cart  cart = getCartByCurrentStaff();
        cartItemRepository.deleteByIdAndCart(idCartItem, cart);
    }

    @Override
    public List<Integer> updateQuantityCartItems(List<CartItemUpdateForm> itemUpdateForms, Boolean isMerge) {
        return isMerge ? mergeCart(itemUpdateForms) : updateCart(itemUpdateForms);
    }

    @Override
    public List<ProductResponse> findProductsByStoreAndCategory(Integer storeId, Integer categoryId) {
        Store store = storeService.findById(storeId);

        return storeProductService.findAllByStore(store).stream()
                .filter(storeProduct -> {
                    if (categoryId != -1) {
                        return storeProduct.getProduct().getCategories().stream()
                                .anyMatch(category -> category.getId().equals(categoryId));
                    }
                    return true;
                })
                .map(storeProduct -> ProductResponse.build(storeProduct.getProduct(), store.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public PageableProductResponse findProductsByStoreAndCategory(Integer storeId, Integer categoryId, Pageable pageable) {
        Store store = storeService.findById(storeId);

        Page<StoreProduct> productPages = storeProductService.findAllByStore(store, pageable);

        List<ProductResponse> productResponses = productPages.getContent().stream()
                .filter(storeProduct -> {
                    if (categoryId != -1) {
                        return storeProduct.getProduct().getCategories().stream()
                                .anyMatch(category -> category.getId().equals(categoryId));
                    }
                    return true;
                })
                .map(storeProduct -> ProductResponse.build(storeProduct.getProduct(), store.getName()))
                .collect(Collectors.toList());

        return PageableProductResponse.builder()
                .currentPage(productPages.getPageable().getPageNumber() + 1)
                .totalPages(productPages.getTotalPages())
                .totalElements((int) productPages.getTotalElements())
                .size(productResponses.size())
                .products(productResponses)
                .build();
    }

    @Override
    public void clearCart(Integer cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException(String.valueOf(cartId)));
        cartItemRepository.deleteByCart(cart);
    }

    @Override public Charge paymentCheckout(PaymentForm paymentForm) throws StripeException {
        Charge charge = pay(paymentForm);

        Cart cart = cartRepository.findByStaff(securityUtil.getCurrentStaff())
                .orElseThrow(() -> new CartNotFoundException("... unknown"));
        List<CartItem> cartItems = cartItemRepository.findAllByCart(cart);

        Order order = Order.build(cart, cartItems, paymentForm, charge.getId());
        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> OrderItem.build(cartItem, order))
                .collect(Collectors.toList());

        updateProductQuantity(cartItems);

        cartItemRepository.deleteAll(cartItems);

        orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);

        return charge;
    }

    @Override
    public List<Order> findAllOrder() { return orderRepository.findAllByStaff(securityUtil.getCurrentStaff()); }

    private int getQuantityFromCartItemUpdateForms(List<CartItemUpdateForm> itemUpdateForms, CartItem cartItem) {
        int temp = -1;
        Optional<CartItemUpdateForm> optionalCartItemUpdateForm = itemUpdateForms.stream()
                .filter(e -> {
                    boolean flag1 = e.getIdCartItem().equals(cartItem.getId());
                    boolean flag2 = !e.getQuantity().equals(cartItem.getQuantity());

                    return flag1 && flag2;
                })
                .findFirst();
        if (optionalCartItemUpdateForm.isPresent()) {
            CartItemUpdateForm itemUpdateForm = optionalCartItemUpdateForm.get();
            temp = itemUpdateForm.getQuantity();
        }

        return temp;
    }

    private CartItem getCartItemInCart(CartItemUpdateForm cartItemUpdateForm, List<CartItem> cartItems) {
        CartItem temp = null;
        Optional<CartItem> optionalCartItem = cartItems.stream()
                .filter(cartItem -> cartItem.getId().equals(cartItemUpdateForm.getIdCartItem()))
                .findFirst();
        if (optionalCartItem.isPresent()) temp = optionalCartItem.get();

        return temp;
    }

    private Cart getCartByCurrentStaff() {
        Optional<Cart> optionalCart = cartRepository.findByStaff(securityUtil.getCurrentStaff());
        return optionalCart.orElse(null);
    }

    private Charge pay(PaymentForm paymentForm) throws StripeException {
        Stripe.apiKey = stripe_api_key;

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentForm.getTotalPrice() * 100);
        params.put("currency", "usd");
        params.put("source", paymentForm.getStripeToken());
        params.put("description", "Charge With User " + securityUtil.getCurrentStaff().getId());

        return Charge.create(params);
    }

    private List<Integer> updateCart(List<CartItemUpdateForm> cartItemUpdateForms) {
        List<Integer> invalid = new ArrayList<>();

        Cart cart = getCartByCurrentStaff();
        List<CartItem> cartItems = cartItemRepository.findAllByCart(cart);

        cartItems.forEach(cartItem -> {
            int temp = getQuantityFromCartItemUpdateForms(cartItemUpdateForms, cartItem);
            if (temp != -1) { // is exists
                Product product = cartItem.getProduct();
                if(temp > product.getQuantity()) {
                    invalid.add(cartItem.getId());
                } else {
                    cartItem.setQuantity(temp);
                }
            }
        });

        cartItemRepository.saveAll(cartItems);
        return invalid;
    }

    private void updateProductQuantity(List<CartItem> cartItems) {
        List<Product> products = cartItems.stream().peek(cartItem -> {
            Product product = cartItem.getProduct();
            if (product.getQuantity() == 0) {
                throw new NotEnoughQuantityException("product not enough quantity");
            }
            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
        })
                .map(CartItem::getProduct)
                .collect(Collectors.toList());
        products.forEach(product -> System.out.println(product.getName() + " : " + product.getQuantity()));
        productService.save(products);
    }

    private List<Integer> mergeCart(List<CartItemUpdateForm> cartItemMergeForms) {
        List<Integer> invalid = new ArrayList<>();

        Cart cart = getCartByCurrentStaff();
        List<CartItem> cartItems = cartItemRepository.findAllByCart(cart);

        cartItemMergeForms.forEach(cartItemMergeForm -> {
            CartItem cartItem = getCartItemInCart(cartItemMergeForm, cartItems);
            int quantity = (cartItem == null)
                    ? cartItemMergeForm.getQuantity()
                    : cartItem.getQuantity() + cartItemMergeForm.getQuantity();

            Product product = cartItem != null
                    ? cartItem.getProduct()
                    : productService.findById(cartItemMergeForm.getIdCartItem());

            if (cartItem == null) {
                cartItem = new CartItem(null, cart, product, Integer.MAX_VALUE, new Date());
                cartItems.add(cartItem);
            }

            if (product.getQuantity() < quantity) {
                invalid.add(cartItemMergeForm.getIdCartItem());
                cartItem.setQuantity(product.getQuantity());
            } else {
                cartItem.setQuantity(quantity);
            }
        });

        cartItemRepository.saveAll(cartItems);
        return invalid;
    }

}
