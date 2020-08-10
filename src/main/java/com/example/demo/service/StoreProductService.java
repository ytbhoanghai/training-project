package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.entity.Store;
import com.example.demo.entity.StoreProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StoreProductService {

    List<StoreProduct> findAllByStore(Store store);

    Page<StoreProduct> findAllByStore(Store store, Pageable pageable);

    void addProductToStore(Integer storeId, Integer productId, Integer quantity);

    void deleteByStore(Store store);

    List<StoreProduct> findAllByProductIsNotIn(List<Product> products);

    void deleteProductFormStore(Integer storeId, Integer productId);
}
