package com.example.demo.exception;

public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(Integer id) {
        super("Order not found by id " + id);
    }
}
