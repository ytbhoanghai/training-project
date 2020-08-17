package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.exception.*;
import com.example.demo.form.CartItemMergeForm;
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
import com.fasterxml.jackson.core.JsonProcessingException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
    private StaffService staffService;

    @Autowired
    public CustomerServiceImpl(SecurityUtil securityUtil,
                               CartRepository cartRepository,
                               CartItemRepository cartItemRepository,
                               OrderRepository orderRepository,
                               OrderItemRepository orderItemRepository,
                               ProductService productService,
                               StoreService storeService,
                               CategoryService categoryService,
                               StoreProductService storeProductService,
                               StaffService staffService) {

        this.securityUtil = securityUtil;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;

        this.productService         = productService;
        this.storeService           = storeService;
        this.categoryService        = categoryService;
        this.storeProductService    = storeProductService;
        this.staffService           = staffService;
    }

    @Override
    public CartResponse getMyCart() {
        Cart cart = getCartByCurrentStaff();
        if (cart != null) {
            List<CartItem> cartItems = cartItemRepository.findAllByCart(cart);
            return CartResponse.build(cart, cartItems);
        }

        Staff staff = securityUtil.getCurrentStaff();
        cart = cartRepository.save(new Cart(null, staff, null, new Date()));
        return CartResponse.build(cart, Collections.emptyList());
    }

    @Override
    public CartItemResponse addCartItem(Integer storeId, Integer productId, Integer quantity) throws JsonProcessingException {
        Cart cart = getCartByCurrentStaff();
        Product product = getProductInStore(storeId, productId);

        Store store = storeService.findById(storeId);
        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(new CartItem(null, cart, product, store, 0, new Date()));

        if (cart.getStore() == null) {
            cart.setStore(store);
            cartRepository.save(cart);
        } else {
            if (!cart.getStore().getId().equals(storeId)) {
                throw new ProductNotSameStoreException(Collections.singletonList(productId));
            }
        }


        StoreProduct storeProduct = storeProductService.findById(new StoreProduct.StoreProductID(storeId, productId));
        if (cartItem.getQuantity() + quantity > storeProduct.getQuantity()) {
            throw new NotEnoughQuantityException("not enough quantity !!!");
        }

        cartItem.setQuantity(cartItem.getQuantity() + quantity);
        return CartItemResponse.build(cartItemRepository.save(cartItem));
    }

    @Override
    public void removeCartItem(Integer idCartItem) {
        Cart cart = getCartByCurrentStaff();
        cartItemRepository.deleteByIdAndCart(idCartItem, cart);

        List<CartItem> cartItems = cartItemRepository.findAllByCart(cart);
        if (cartItems.size() == 0) {
            cart.setStore(null);
            cartRepository.save(cart);
        }
    }

    @Override
    public List<Integer> updateQuantityCartItems(List<CartItemUpdateForm> itemUpdateForms) {
        return updateCart(itemUpdateForms);
    }

    @Override
    public List<Integer> mergeCart(List<CartItemMergeForm> cartItemMergeForms) throws JsonProcessingException {
        List<Integer> invalid = new ArrayList<>();

        Cart cart = getCartByCurrentStaff();
        List<CartItem> cartItems = cartItemRepository.findAllByCart(cart);

        List<Integer> idsProductNotSameStore = new ArrayList<>();
        if (cart.getStore() == null) {
            Integer firstStoreId = cartItemMergeForms.get(0).getStoreId();
            for (int i = 1; i < cartItemMergeForms.size(); i++) {
                Integer nextStoreId = cartItemMergeForms.get(i).getStoreId();
                if (!nextStoreId.equals(firstStoreId)) {
                    idsProductNotSameStore.add(cartItemMergeForms.get(i).getProductId());
                }
            }
        } else {
            idsProductNotSameStore = cartItemMergeForms.stream()
                    .filter(cartItemMergeForm -> !cartItemMergeForm.getStoreId().equals(cart.getStore().getId()))
                    .map(CartItemMergeForm::getProductId)
                    .collect(Collectors.toList());
        }

        if (idsProductNotSameStore.size() != 0) {
            throw new ProductNotSameStoreException(idsProductNotSameStore);
        }

        cartItemMergeForms.forEach(cartItemMergeForm -> {
            CartItem cartItem = getCartItemInCart(cartItemMergeForm, cartItems);

            int quantity = (cartItem == null)
                    ? cartItemMergeForm.getQuantity()
                    : cartItem.getQuantity() + cartItemMergeForm.getQuantity();

            Product product = (cartItem == null)
                    ? getProductInStore(cartItemMergeForm.getStoreId(), cartItemMergeForm.getProductId())
                    : cartItem.getProduct();

            if (cartItem == null) {
                Store store = storeService.findById(cartItemMergeForm.getStoreId());
                cartItem = new CartItem(null, cart, product, store, Integer.MIN_VALUE, new Date());
                cartItems.add(cartItem);
            }

            StoreProduct.StoreProductID id = new StoreProduct.StoreProductID(cartItemMergeForm.getStoreId(), cartItemMergeForm.getProductId());
            StoreProduct storeProduct = storeProductService.findById(id);

            if (storeProduct.getQuantity() < quantity) {
                invalid.add(cartItemMergeForm.getProductId());
                cartItem.setQuantity(storeProduct.getQuantity());
            } else {
                cartItem.setQuantity(quantity);
            }
        });

        cart.setStore(cartItems.get(0).getStore());
        cartRepository.save(cart);
        cartItemRepository.saveAll(cartItems);
        return invalid;
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
                .map(storeProduct -> ProductResponse.build(storeProduct, store.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public PageableProductResponse findProductsByStoreAndCategory(Integer storeId, Integer categoryId, Pageable pageable) {
        Store store = storeService.findById(storeId);

        List<StoreProduct> storeProductList = storeProductService.findAllByStore(store);

        Supplier<Stream<ProductResponse>> streamSupplier = () -> storeProductList.stream()
                .filter(storeProduct -> {
                    if (categoryId != -1) {
                        return storeProduct.getProduct().getCategories().stream()
                                .anyMatch(category -> category.getId().equals(categoryId));
                    }
                    return true;
                })
                .map(storeProduct -> ProductResponse.build(storeProduct, store.getName()));

        double totalElements = streamSupplier.get().count();

        List<ProductResponse> productResponses = streamSupplier.get()
                .skip(pageable.getPageNumber() * pageable.getPageSize())
                .limit(pageable.getPageSize())
                .collect(Collectors.toList());

        return PageableProductResponse.builder()
                .currentPage(pageable.getPageNumber() + 1)
                .totalPages((int) Math.ceil(totalElements / pageable.getPageSize()))
                .totalElements((int) totalElements)
                .size(productResponses.size())
                .products(productResponses)
                .build();
    }

    @Override
    public void clearCart(Integer cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException(String.valueOf(cartId)));
        cartItemRepository.deleteByCart(cart);

        cart.setStore(null);
        cartRepository.save(cart);
    }

    @Override
    public Charge paymentCheckout(PaymentForm paymentForm) throws StripeException {
        Charge charge = pay(paymentForm);

        Cart cart = cartRepository.findByStaff(securityUtil.getCurrentStaff())
                .orElseThrow(() -> new CartNotFoundException("... unknown"));
        List<CartItem> cartItems = cartItemRepository.findAllByCart(cart);

        Order order = Order.build(cart, cartItems, paymentForm, charge.getId());
        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> OrderItem.build(cartItem, order))
                .collect(Collectors.toList());

        updateStoreProductQuantity(cartItems);

        cartItemRepository.deleteAll(cartItems);

        orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);

        cart.setStore(null);
        cartRepository.save(cart);

        return charge;
    }

    @Override
    public List<Order> findAllOrder() {
        return orderRepository.findAllByStaff(securityUtil.getCurrentStaff());
    }

    @Override
    public Order updateOrderStatus(Integer orderId, OrderUpdateForm orderUpdateForm) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(OrderNotFoundException::new);
        order.setStatus(orderUpdateForm.getStatus());
        return orderRepository.save(order);
    }

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

    private CartItem getCartItemInCart(CartItemMergeForm cartItemMergeForm, List<CartItem> cartItems) {
        CartItem temp = null;
        Optional<CartItem> optionalCartItem = cartItems.stream()
                .filter(cartItem -> {
                    Product product = cartItem.getProduct();
                    return product.getId().equals(cartItemMergeForm.getProductId());
                })
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
                if (temp > product.getQuantity()) {
                    invalid.add(cartItem.getId());
                } else {
                    cartItem.setQuantity(temp);
                }
            }
        });

        cartItemRepository.saveAll(cartItems);
        return invalid;
    }

    private void updateStoreProductQuantity(List<CartItem> cartItems) {
        cartItems.forEach(cartItem -> {
            StoreProduct.StoreProductID id = new StoreProduct.StoreProductID(cartItem.getStore().getId(), cartItem.getProduct().getId());
            StoreProduct storeProduct = storeProductService.findById(id);
            if (storeProduct.getQuantity() == 0) {
                throw new NotEnoughQuantityException("product not enough quantity");
            }
            storeProduct.setQuantity(storeProduct.getQuantity() - cartItem.getQuantity());
            storeProductService.save(storeProduct);
        });
    }

    private Product getProductInStore(Integer storeId, Integer productId) {
        Product product = storeService.getProductById(storeId, productId);
        if (product == null) {
            throw new ProductNotExistsInStoreException(new StoreProduct.StoreProductID(storeId, productId));
        }
        return product;
    }


}
