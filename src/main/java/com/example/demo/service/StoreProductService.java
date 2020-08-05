package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.entity.Store;
import com.example.demo.entity.StoreProduct;

import java.util.List;

public interface StoreProductService {

    List<StoreProduct> findAllByStore(Store store);

    void addProductToStore(Integer storeId, Integer productId, Integer quantity);

    void deleteByStore(Store store);

    List<StoreProduct> findAllByProductIsNotIn(List<Product> products);

    void deleteProductFormStore(Integer storeId, Integer productId);
}
