package com.example.demo.controller.ui;

import com.example.demo.entity.Category;
import com.example.demo.form.CategoryForm;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.Valid;
import java.util.List;

@Transactional
public interface ICategory {

    List<Category> findAllCategories();

    Category findCategoryById(Integer id);

    Category updateCategory(Integer id, @Valid CategoryForm categoryForm);

    Category createCategory(@Valid CategoryForm categoryForm);

    Integer deleteCategory(Integer id);

}
