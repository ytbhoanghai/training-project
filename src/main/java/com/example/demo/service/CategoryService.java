package com.example.demo.service;

import com.example.demo.entity.Category;
import com.example.demo.entity.Store;
import com.example.demo.form.CategoryForm;
import com.example.demo.response.SimpleCategoryResponse;

import java.util.List;

public interface CategoryService {

    List<SimpleCategoryResponse> findAll();

    List<Category> findAllByStore(Store store);

    Category findById(Integer id);

    Category save(CategoryForm categoryForm);

    Category update(Integer id, CategoryForm categoryForm);

    Integer deleteById(Integer id);

}
