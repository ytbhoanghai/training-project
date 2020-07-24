package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.entity.Store;
import com.example.demo.entity.StoreProduct;
import com.example.demo.exception.ProductNotFoundException;
import com.example.demo.exception.StoreNotFoundException;
import com.example.demo.form.AddProductToStoreForm;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.StoreProductRepository;
import com.example.demo.repository.StoreRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class StoreProductServiceImpl implements StoreProductService {

    private StoreProductRepository storeProductRepository;
    private StoreRepository storeRepository;
    private ProductRepository productRepository;

    @Autowired
    public StoreProductServiceImpl(
            StoreProductRepository storeProductRepository,
            StoreRepository storeRepository,
            ProductRepository productRepository) {
        this.storeProductRepository = storeProductRepository;
        this.storeRepository = storeRepository;
        this.productRepository = productRepository;
    }


    @Override
    public StoreProduct addProductToStore(AddProductToStoreForm addProductToStoreForm) {
//        Would be foreign key error if the input is wrong
        Integer storeId = addProductToStoreForm.getStoreId();
        Integer productId = addProductToStoreForm.getProductId();
        Integer quantity = addProductToStoreForm.getQuantity();

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new StoreNotFoundException(storeId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        StoreProduct storeProduct = storeProductRepository.save(StoreProduct.addProductToStore(store, product, quantity));
        return storeProduct;
    }
}
