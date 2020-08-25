package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.exception.ProductNotFoundException;
import com.example.demo.exception.StoreNotFoundException;
import com.example.demo.form.ProductForm;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.StoreRepository;
import com.example.demo.response.PageableProductResponse;
import com.example.demo.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service(value = "productService")
public class ProductServiceImpl implements ProductService {

    private ProductRepository productRepository;
    private SecurityUtil securityUtil;
    private CategoryRepository categoryRepository;
    private StoreRepository storeRepository;

    @Autowired
    public ProductServiceImpl(
            ProductRepository productRepository,
            SecurityUtil securityUtil,
            CategoryRepository categoryRepository,
            StoreRepository storeRepository
    ) {

        this.productRepository = productRepository;
        this.securityUtil = securityUtil;
        this.categoryRepository = categoryRepository;
        this.storeRepository = storeRepository;
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public PageableProductResponse findAll(Integer page, Integer size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Product> products = productRepository.findAll(pageRequest);
        return PageableProductResponse.build(products);
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
        Store store = storeRepository.findById(productForm.getStoreId())
                .orElseThrow(() -> new StoreNotFoundException(productForm.getStoreId()));

        return productRepository.save(
                ProductForm.buildProduct(productForm, store, createByStaff, categories));
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
