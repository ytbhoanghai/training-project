package com.example.demo.service;

import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.entity.Store;
import com.example.demo.form.ProductForm;
import com.example.demo.response.PageableProductResponse;

import java.util.List;

public interface ProductService {

    List<Product> findAll();

    PageableProductResponse findAll(Integer page, Integer size);

    Product findById(Integer id);

    Product save(ProductForm productForm);

    Product save(Product product);

    Product update(Integer id, ProductForm productForm);

    void delete(Integer id);

    void save(List<Product> products);
}
