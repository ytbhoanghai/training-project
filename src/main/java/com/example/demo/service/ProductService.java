package com.example.demo.service;

import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.entity.Store;
import com.example.demo.form.ProductForm;

import java.util.List;

public interface ProductService {

    List<Product> findAll();

    Product findById(Integer id);

    Product save(ProductForm productForm);

    Product update(Integer id, ProductForm productForm);

    void delete(Integer id);

}
