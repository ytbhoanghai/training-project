package com.example.demo.exception;

public class StoreNotFoundException extends RuntimeException {

    public StoreNotFoundException(Integer id) {
        super("Store Not Found By ID " + id);
    }
}
