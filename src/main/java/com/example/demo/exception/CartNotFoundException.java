package com.example.demo.exception;

public class CartNotFoundException extends RuntimeException {
    public CartNotFoundException(String id) {
        super("cart not found by id " + id);
    }
}
