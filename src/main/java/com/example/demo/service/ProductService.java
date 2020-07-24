package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.form.ProductForm;

import java.util.List;

public interface ProductService {

    List<Product> findAll();

    Product findById(Integer id);

    List<Product> findAllByStore();

    Product save(ProductForm productForm);

    Product update(Integer id, ProductForm productForm);

    void delete(Integer id);

}
