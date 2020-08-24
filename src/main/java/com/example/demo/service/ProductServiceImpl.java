package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.exception.ProductNotFoundException;
import com.example.demo.form.ProductForm;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service(value = "productService")
public class ProductServiceImpl implements ProductService {

    private ProductRepository productRepository;
    private SecurityUtil securityUtil;
    private CategoryRepository categoryRepository;

    @Autowired
    public ProductServiceImpl(
            ProductRepository productRepository,
            SecurityUtil securityUtil,
            CategoryRepository categoryRepository) {

        this.productRepository = productRepository;
        this.securityUtil = securityUtil;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public Product findById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    @Override
    public Product save(ProductForm productForm) {
        Staff createByStaff = securityUtil.getCurrentStaff();
        Set<Category> categories = categoryRepository.findAllByIdIsIn(productForm.getCategories());
        return productRepository.save(
                ProductForm.buildProduct(productForm, createByStaff, categories));
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product update(Integer id, ProductForm productForm) {
        Product product = findById(id);
        Set<Category> categories = categoryRepository.findAllByIdIsIn(productForm.getCategories());
        return productRepository.save(
                Product.updateData(product, productForm, categories));
    }

    @Override
    public void delete(Integer id) {
        productRepository.deleteById(id);
    }

    @Override
    public void save(List<Product> products) {
        productRepository.saveAll(products);
    }

}
