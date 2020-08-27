package com.example.demo.controller.ui;

import com.example.demo.entity.Product;
import com.example.demo.form.ProductForm;

import javax.validation.Valid;
import java.util.List;

public interface IProduct {

    Product createProduct(@Valid ProductForm productForm);

    Product updateProduct(Integer id, @Valid ProductForm productForm);

    Product findProductById(Integer id);

    List<Product> findAllProducts();

    Integer deleteProductById(Integer id);

}
