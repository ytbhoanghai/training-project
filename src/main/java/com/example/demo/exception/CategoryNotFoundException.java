package com.example.demo.exception;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(Integer id) {
        super("Category Not Found By ID " + id);
    }
}
