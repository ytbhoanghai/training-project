package com.example.demo.service;

import com.example.demo.entity.Order;
import com.example.demo.form.CartItemUpdateForm;
import com.example.demo.form.PaymentForm;
import com.example.demo.response.CartItemResponse;
import com.example.demo.response.CartResponse;
import com.example.demo.response.PageableProductResponse;
import com.example.demo.response.ProductResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomerService {

    CartResponse getMyCart();

    CartItemResponse addCartItem(Integer productId, Integer quantity);

    @Transactional
    void removeCartItem(Integer idCartItem);

    List<Integer> updateQuantityCartItems(List<CartItemUpdateForm> itemUpdateForms, Boolean isMerge);

    List<ProductResponse> findProductsByStoreAndCategory(Integer storeId, Integer CategoryId);

    PageableProductResponse findProductsByStoreAndCategory(
            Integer storeId, Integer categoryId, Pageable pageable
    );

    void clearCart(Integer cartId);

    Charge paymentCheckout(PaymentForm paymentForm) throws StripeException;

    List<Order> findAllOrder();
}
