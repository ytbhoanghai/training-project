package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.entity.StoreProduct;
import com.example.demo.exception.StoreNotFoundException;
import com.example.demo.form.AddProductToStoreForm;
import com.example.demo.form.StoreForm;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.StoreRepository;
import com.example.demo.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreServiceImpl implements StoreService {

    private StoreRepository storeRepository;
    private ProductRepository productRepository;
    private StoreProductService storeProductService;
    private StaffServiceImpl staffService;
    private SecurityUtil securityUtil;

    @Autowired
    public StoreServiceImpl(
            StoreRepository storeRepository,
            ProductRepository productRepository,
            StoreProductService storeProductService,
            StaffServiceImpl staffService,
            SecurityUtil securityUtil) {

        this.storeRepository = storeRepository;
        this.productRepository = productRepository;
        this.storeProductService = storeProductService;
        this.staffService = staffService;
        this.securityUtil = securityUtil;
    }

    @Override
    public List<Store> findAll() {
        return storeRepository.findAll();
    }

    @Override
    public Store findById(Integer id) {
        return storeRepository.findById(id)
                .orElseThrow(() -> new StoreNotFoundException(id));
    }

    @Override
    public Store save(StoreForm storeForm) {
        Staff staff = staffService.findByUsername(securityUtil.getCurrentPrincipal().getUsername());
        return storeRepository.save(StoreForm.buildStore(storeForm, staff));
    }

    @Override
    public StoreProduct addProductToStore(AddProductToStoreForm addProductToStoreForm) {
        return storeProductService.addProductToStore(addProductToStoreForm);
    }

    @Override
    public Store update(Integer id, StoreForm storeForm) {
        Store store = findById(id);
        return storeRepository.save(Store.updateData(store, storeForm));
    }

    @Override
    public String deleteById(Integer id) {
        storeRepository.deleteById(id);
        return String.valueOf(id);
    }
}
