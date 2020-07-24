package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.entity.StoreProduct;
import com.example.demo.form.AddProductToStoreForm;
import com.example.demo.form.StoreForm;

import java.util.List;
import java.util.Optional;

public interface StoreService {

    List<Store> findAll();

    Store findById(Integer id);

    Store save(StoreForm storeForm);

    StoreProduct addProductToStore(AddProductToStoreForm addProductToStoreForm);

    Store update(Integer id, StoreForm storeForm);

    String deleteById(Integer id);
}
