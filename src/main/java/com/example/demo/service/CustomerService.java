package com.example.demo.service;

import com.example.demo.form.CartItemUpdateForm;
import com.example.demo.response.CartItemResponse;
import com.example.demo.response.CartResponse;
import com.example.demo.response.ProductResponse;

import java.util.List;

public interface CustomerService {

    CartResponse getMyCart();

    CartItemResponse addCartItem(Integer productId, Integer quantity);

    void removeCartItem(Integer idCartItem);

    List<Integer> updateQuantityCartItems(List<CartItemUpdateForm> itemUpdateForms);

    List<ProductResponse> findProductsByStoreAndCategory(Integer storeId, Integer categoryId);
}
