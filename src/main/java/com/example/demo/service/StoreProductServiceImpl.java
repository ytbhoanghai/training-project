package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.entity.Store;
import com.example.demo.entity.StoreProduct;
import com.example.demo.entity.StoreProduct.StoreProductID;
import com.example.demo.exception.ProductNotFoundException;
import com.example.demo.exception.StoreNotFoundException;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.StoreProductRepository;
import com.example.demo.repository.StoreRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@Transactional
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
    public List<StoreProduct> findAllByStore(Store store) {
        return storeProductRepository.findAllByStore(store);
    }

    @Override
    public void addProductToStore(Integer storeId, Integer productId, Integer quantity) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new StoreNotFoundException(storeId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        StoreProduct.StoreProductID id = new StoreProduct.StoreProductID(store.getId(), product.getId());
        StoreProduct storeProduct = new StoreProduct(id, quantity, store, product);

        storeProductRepository.save(storeProduct);
    }

    @Override
    public void deleteProductFormStore(Integer storeId, Integer productId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new StoreNotFoundException(storeId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        StoreProductID id = new StoreProductID(store.getId(), product.getId());
        System.out.println(id);
        storeProductRepository.deleteById(id);
    }

    @Override
    public void deleteByStore(Store store) {
        storeProductRepository.deleteByStore(store);
    }

    @Override
    public List<StoreProduct> findAllByProductIsNotIn(List<Product> products) {
        return storeProductRepository.findAllByProductIsNotIn(products);
    }

}
