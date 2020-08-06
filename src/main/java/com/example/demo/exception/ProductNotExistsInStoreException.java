package com.example.demo.exception;

import com.example.demo.entity.StoreProduct;

public class ProductNotExistsInStoreException extends RuntimeException {
    public ProductNotExistsInStoreException(StoreProduct.StoreProductID id) {
        super(String.format("Product with id %d is not exists in store %d", id.getIdProduct(), id.getIdStore()));
    }
}
