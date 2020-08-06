package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.exception.CartNotFoundException;
import com.example.demo.exception.CategoryNotFoundException;
import com.example.demo.exception.NotEnoughQuantityException;
import com.example.demo.form.CartItemUpdateForm;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.CartRepository;
import com.example.demo.response.CartItemResponse;
import com.example.demo.response.CartResponse;
import com.example.demo.response.ProductResponse;
import com.example.demo.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.Id;
import java.util.*;
import java.util.stream.Collectors;

@Service(value = "customerService")
public class CustomerServiceImpl implements CustomerService {

    private SecurityUtil securityUtil;
    private CartRepository cartRepository;
    private CartItemRepository cartItemRepository;
    private ProductService productService;
    private StoreService storeService;
    private CategoryService categoryService;
    private StoreProductService storeProductService;

    @Autowired
    public CustomerServiceImpl(SecurityUtil securityUtil,
                               CartRepository cartRepository,
                               CartItemRepository cartItemRepository,
                               ProductService productService,
                               StoreService storeService,
                               CategoryService categoryService,
                               StoreProductService storeProductService) {

        this.securityUtil           = securityUtil;
        this.cartRepository         = cartRepository;
        this.cartItemRepository     = cartItemRepository;
        this.productService         = productService;
        this.storeService           = storeService;
        this.categoryService        = categoryService;
        this.storeProductService    = storeProductService;
    }

    @Override
    public CartResponse getMyCart() {
        Staff staff = securityUtil.getCurrentStaff();

        Cart cart = getCartByStaff(staff);
        if (cart != null) {
            List<CartItem> cartItems = cartItemRepository.findAllByCart(cart);
            return CartResponse.build(cart, cartItems);
        }

        cart = cartRepository.save(new Cart(null, staff, new Date()));
        return CartResponse.build(cart, Collections.emptyList());
    }

    @Override
    public CartItemResponse addCartItem(Integer productId, Integer quantity) {
        Cart cart = getCartByStaff(securityUtil.getCurrentStaff());
        Product product = productService.findById(productId);

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(new CartItem(null, cart, product, 0, new Date()));

        if (cartItem.getQuantity() + quantity > product.getQuantity()) {
            throw new NotEnoughQuantityException("not enough quantity !!!");
        }

        cartItem.setQuantity(cartItem.getQuantity() + quantity);
        return CartItemResponse.build(cartItemRepository.save(cartItem));
    }

    @Transactional
    @Override
    public void removeCartItem(Integer idCartItem) {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Cart  cart = getCartByStaff(currentStaff);

        cartItemRepository.deleteByIdAndCart(idCartItem, cart);
    }

    @Override
    public List<Integer> updateQuantityCartItems(List<CartItemUpdateForm> itemUpdateForms) {
        List<Integer> invalid = new ArrayList<>();

        Cart cart = getCartByStaff(securityUtil.getCurrentStaff());
        List<CartItem> cartItems = cartItemRepository.findAllByCart(cart);

        cartItems.forEach(cartItem -> {
            int temp = getQuantityFromItemUpdateForms(itemUpdateForms, cartItem);
            if (temp != -1) { // is exists
                Product product = cartItem.getProduct();
                if(cartItem.getQuantity() + temp > product.getQuantity()) {
                    invalid.add(cartItem.getId());
                } else {
                    cartItem.setQuantity(cartItem.getQuantity() + temp);
                }
            }
        });

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
                .map(storeProduct -> ProductResponse.build(storeProduct.getProduct(), store.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public void clearCart(Integer cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException(String.valueOf(cartId)));
        cartItemRepository.deleteByCart(cart);
    }

    private int getQuantityFromItemUpdateForms(List<CartItemUpdateForm> itemUpdateForms, CartItem cartItem) {
        int temp = -1;
        Optional<CartItemUpdateForm> optionalCartItemUpdateForm = itemUpdateForms.stream()
                .filter(e -> e.getIdCartItem().equals(cartItem.getId()))
                .findFirst();
        if (optionalCartItemUpdateForm.isPresent()) {
            CartItemUpdateForm itemUpdateForm = optionalCartItemUpdateForm.get();
            temp = itemUpdateForm.getQuantity();
        }

        return temp;
    }

    private Cart getCartByStaff(Staff staff) {
        Optional<Cart> optionalCart = cartRepository.findByStaff(staff);
        return optionalCart.orElse(null);
    }
}