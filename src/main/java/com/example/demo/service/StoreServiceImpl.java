package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.exception.StoreNotFoundException;
import com.example.demo.form.StoreForm;
import com.example.demo.repository.StoreRepository;
import com.example.demo.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreServiceImpl implements StoreService {

    private StoreRepository storeRepository;
    private StaffService staffService;
    private SecurityUtil securityUtil;

    @Autowired
    public StoreServiceImpl(
            StoreRepository storeRepository,
            StaffService staffService,
            SecurityUtil securityUtil) {

        this.storeRepository = storeRepository;
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
