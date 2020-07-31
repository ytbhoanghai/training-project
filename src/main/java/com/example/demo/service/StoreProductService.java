package com.example.demo.service;

import com.example.demo.entity.Store;
import com.example.demo.entity.StoreProduct;

public interface StoreProductService {

    void addProductToStore(Integer storeId, Integer productId, Integer quantity);

    void deleteByStore(Store store);
}
