package com.example.demo.service;

import com.example.demo.entity.Store;
import com.example.demo.entity.StoreProduct;
import com.example.demo.form.StoreForm;

import java.util.List;

public interface StoreService {

    List<Store> findAll();

    Store findById(Integer id);

    Store save(StoreForm storeForm);

    StoreProduct addProductToStore(Integer storeId, Integer productId, Integer quantity);

    Store update(Integer id, StoreForm storeForm);

    String deleteById(Integer id);
}
