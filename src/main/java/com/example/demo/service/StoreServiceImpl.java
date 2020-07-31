package com.example.demo.service;

import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.entity.StoreProduct;
import com.example.demo.exception.RoleNotFoundException;
import com.example.demo.exception.StoreNotFoundException;
import com.example.demo.form.StoreForm;
import com.example.demo.form.StoreUpdateForm;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.StoreRepository;
import com.example.demo.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StoreServiceImpl implements StoreService {

    private StoreRepository storeRepository;
    private ProductRepository productRepository;
    private RoleRepository roleRepository;
    private StoreProductService storeProductService;
    private StaffService staffService;
    private SecurityUtil securityUtil;

    @Autowired
    public StoreServiceImpl(
            StoreRepository storeRepository,
            ProductRepository productRepository,
            RoleRepository roleRepository,
            StoreProductService storeProductService,
            StaffService staffService,
            SecurityUtil securityUtil) {

        this.storeRepository = storeRepository;
        this.productRepository = productRepository;
        this.roleRepository = roleRepository;
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
        Staff staff = securityUtil.getCurrentStaff();
        return storeRepository.save(StoreForm.buildStore(storeForm, staff));
    }

    @Override
    public void addProductToStore(Integer storeId, Integer productId, Integer quantity) {
        storeProductService.addProductToStore(storeId, productId, quantity);
    }

    @Override
    public Store update(Integer id, StoreUpdateForm storeUpdateForm) {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Store store = findById(id);

        List<Staff> storeManagerList = staffService.findAllByStoreAndIsManager(store, true);
        List<Staff> newStoreManagerList = staffService.findAllByIdIsIn(storeUpdateForm.getIdManagers());

        if (!currentStaff.isAdmin()) {
            Set<Integer> idStoreManagerList = storeManagerList.stream()
                    .map(Staff::getId)
                    .collect(Collectors.toSet());
            if (!idStoreManagerList.equals(storeUpdateForm.getIdManagers())) {
                throw new AccessDeniedException("you don't have permission to update manager list of this store");
            }
        }

        setAndSaveIsManagerForListStaff(storeManagerList, false, null); // disable all is manager of store
        setAndSaveIsManagerForListStaff(newStoreManagerList, true, store); // set new manager for store


        return storeRepository.save(Store.updateData(store, storeUpdateForm));
    }

    @Override
    @Transactional
    public String deleteById(Integer id) {
        Store store = findById(id);
        // remove store in staff
        List<Staff> staffListAfterRemoveStore = staffService.findAllByStore(store).stream()
                .map(staff -> {
                    staff.setStore(null);
                    return staff;
                })
                .collect(Collectors.toList());
        staffService.saveAll(staffListAfterRemoveStore);

        // delete products in store
        storeProductService.deleteByStore(store);

        // delete store
        storeRepository.deleteById(id);

        return String.valueOf(id);
    }

    @Override
    public void addStaffListToStore(Integer storeId, Set<Integer> idStaff) {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new StoreNotFoundException(storeId));

        if (!currentStaff.isAdmin() && !currentStaff.getStore().equals(store)) {
            throw new AccessDeniedException("You don't have permission to add staff list in this store");
        }

        List<Staff> currentStaffListInStore = staffService.findAllByStore(store);
        List<Staff> staffList = staffService.findAllByIdIsIn(idStaff);
        List<Staff> listStaffNotInvalid = staffList.stream()
                .filter(staff -> !staff.getStore().equals(store))
                .collect(Collectors.toList());

        if (!listStaffNotInvalid.isEmpty()) {
            StringBuilder message = new StringBuilder("Staffs with id is");
            for (Staff staff : listStaffNotInvalid) {
                message.append(" ").append(staff.getId());
            }
            throw new IllegalArgumentException(message.append(" already in another store").toString());
        }

        setAndSaveStaffListForStore(currentStaffListInStore, null, true);
        setAndSaveStaffListForStore(currentStaffListInStore, store, false);
    }

    @Override
    public List<Staff> findStaffsByStoreAndIsManager(Integer storeId, Boolean isManager) {
        Store store = findById(storeId);
        return staffService.findAllByStoreAndIsManager(store, isManager);
    }

    private void setAndSaveStaffListForStore(List<Staff> staffList, Store store, Boolean remove) {
        staffList.forEach(staff -> {
            if (remove) {
                staff.setStore(null);
            } else {
                staff.setStore(store);
            }
        });

        staffService.saveAll(staffList);
    }

    private void setAndSaveIsManagerForListStaff(List<Staff> staffList, Boolean isManager, Store store) {
        // get role store_manager
        Role role = roleRepository.findById(2)
                .orElseThrow(() -> new RoleNotFoundException(1));

        staffList.forEach(staff -> {
            staff.setIsManager(isManager);
            if (isManager) { // if isManager is true then add role store_manager for staffs
                staff.getRoles().add(role);
                staff.setStore(store);
            } else {
                staff.getRoles().remove(role);
            }
        });
        // save all
        staffService.saveAll(staffList);
    }


}
