package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.form.StoreForm;
import com.example.demo.form.StoreUpdateForm;
import com.example.demo.response.StoreProductResponse;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

public interface StoreService {

    List<Store> findAll();

    Store findById(Integer id);

    Store save(StoreForm storeForm);

    void addProductToStore(Integer storeId, Integer productId, Integer quantity);

    Store update(Integer id, StoreUpdateForm storeUpdateForm);

    String deleteById(Integer id);

    void addStaffListToStore(Integer storeId, Set<Integer> idStaff);

    List<Staff> findStaffsByStoreAndIsManager(Integer storeId, Boolean isManager);

    List<StoreProductResponse> findProductsByStoreAndIsAdded(Integer storeId, Boolean isAdded);

    void deleteProductFromStore(Integer storeId, Integer productId);

    List<Store> getManageableStores();

    List<Staff> findStaffsByStore(Integer storeId);

    void removeStaffFromStore(Integer storeId, Integer staffId);

    void addStaffToStore(Integer storeId, Integer staffId);
}
