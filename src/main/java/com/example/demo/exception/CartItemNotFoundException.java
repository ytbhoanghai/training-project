package com.example.demo.exception;

public class CartItemNotFoundException extends RuntimeException {
    public CartItemNotFoundException(Integer id) {
        super("cart item not found by id " + id);
    }
}
