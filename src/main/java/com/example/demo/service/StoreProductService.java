package com.example.demo.service;

import com.example.demo.entity.StoreProduct;
import com.example.demo.form.AddProductToStoreForm;

public interface StoreProductService {
    StoreProduct addProductToStore(AddProductToStoreForm addProductToStoreForm);
}
