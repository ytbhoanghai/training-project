package com.example.demo.controller;

import com.example.demo.entity.Category;
import com.example.demo.form.CategoryForm;
import com.example.demo.response.MessageResponse;
import com.example.demo.response.SimpleCategoryResponse;
import com.example.demo.security.constants.CategoryPermission;
import com.example.demo.service.CategoryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {

    private CategoryServiceImpl categoryService;

    @Autowired
    public CategoryController(CategoryServiceImpl categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<SimpleCategoryResponse>> findAll() {
        List<SimpleCategoryResponse> categoryResponseList = categoryService.findAll();
        return new ResponseEntity<>(categoryResponseList, HttpStatus.OK);
    }

    @GetMapping("/categories/{categoryId}")
//    @PreAuthorize("hasAuthority(\"" + CategoryPermission.READ + "\")")
    public ResponseEntity<Category> findById(@PathVariable Integer categoryId) {
        Category category = categoryService.findById(categoryId);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @PostMapping("/categories")
//    @PreAuthorize("hasAuthority(\"" + CategoryPermission.CREATE + "\")")
    public ResponseEntity<Category> save(@Valid @RequestBody CategoryForm categoryForm) {
        Category category = categoryService.save(categoryForm);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @PutMapping("/categories/{categoryId}")
//    @PreAuthorize("hasAuthority(\"" + CategoryPermission.UPDATE + "\")")
    public ResponseEntity<Category> update(@PathVariable Integer categoryId, @Valid @RequestBody CategoryForm categoryForm) {
        Category category = categoryService.update(categoryId, categoryForm);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @DeleteMapping("/categories/{categoryId}")
//    @PreAuthorize("hasAuthority(\"" + CategoryPermission.DELETE + "\")")
    public ResponseEntity<MessageResponse> delete(@PathVariable Integer categoryId) {
        categoryService.deleteById(categoryId);
        return new ResponseEntity<>(new MessageResponse("Deleted category with id: " + categoryId), HttpStatus.OK);
    }

}
