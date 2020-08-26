package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.exception.ProductNotFoundException;
import com.example.demo.exception.StoreNotFoundException;
import com.example.demo.form.StoreForm;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.StoreRepository;
import com.example.demo.response.StoreProductResponse;
import com.example.demo.security.SecurityUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class StoreServiceImpl implements StoreService {

    private StoreRepository storeRepository;
    private ProductRepository productRepository;
    private StoreProductService storeProductService;
    private StaffService staffService;
    private SecurityUtil securityUtil;
    private CategoryRepository categoryRepository;

    @Autowired
    public StoreServiceImpl(
            StoreRepository storeRepository,
            ProductRepository productRepository,
            RoleRepository roleRepository,
            StoreProductService storeProductService,
            StaffService staffService,
            SecurityUtil securityUtil,
            CategoryRepository categoryRepository) {

        this.storeRepository = storeRepository;
        this.productRepository = productRepository;
        this.storeProductService = storeProductService;
        this.staffService = staffService;
        this.securityUtil = securityUtil;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Store> findAll() { return storeRepository.findAll(); }

    @Override
    public Store findById(Integer id) {
        return storeRepository.findById(id)
                .orElseThrow(() -> new StoreNotFoundException(id));
    }

    @Override
    public List<Product> findAllProductsByStoreId(Integer storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new StoreNotFoundException(storeId));
        return productRepository.findAllByStore(store);
    }

    @Override
    public List<Category> findCategoriesByStore(Integer storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new StoreNotFoundException(storeId));
        return categoryRepository.findAllByStore(store);
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
    public void deleteProductFromStore(Integer storeId, Integer productId) {
        storeProductService.deleteProductFormStore(storeId, productId);
    }

    @Override
    public List<Store> getManageableStores() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        if (currentStaff.isAdmin()) {
            return storeRepository.findAll();
        }

        if (currentStaff.getIsManager()) {
            Integer storeId = currentStaff.getStore().getId();
            Store store = storeRepository.findById(storeId)
                    .orElseThrow(() -> new StoreNotFoundException(storeId));
            return List.of(store);
        }

        return null;
    }

    @Override
    public List<Staff> findStaffsByStore(Integer storeId) {
        Store store = findById(storeId);
        return staffService.findAllByStore(store);
    }

    @Override
    public void removeStaffFromStore(Integer storeId, Integer staffId) {
        Store store = findById(storeId);

        if (checkPermission(store)) {
            throw new AccessDeniedException("Access Denied !!!");
        }

        Staff staff = staffService.findById(staffId);
        staff.setStore(null);

        staffService.save(staff);
    }

    @Override
    public void addStaffToStore(Integer storeId, Integer staffId) {
        Store store = findById(storeId);

        if(checkPermission(store)) {
            throw new AccessDeniedException("Access Denied!");
        }

        Staff staff = staffService.findById(staffId);
        staff.setStore(store);

        staffService.save(staff);
    }

    @Override
    public Product getProductById(Integer storeId, Integer productId) {
        Store store = findById(storeId);
        return store.getStoreProductList().stream()
                .filter(storeProduct -> storeProduct.getProduct().getId().equals(productId))
                .findFirst()
                .map(StoreProduct::getProduct)
                .orElse(null);
    }

    @Override
    public void updateQuantityOfProductInStore(Integer storeId, Integer productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        Integer _quantity = product.getQuantity();
        product.setQuantity(_quantity + quantity);

        productRepository.save(product);
//        storeProductService.updateQuantityOfProductInStore(storeId, productId, quantity);
    }

    @Override
    public Store update(Integer id, StoreForm storeForm) {
        Store store = findById(id);
        store.setName(storeForm.getName());
        store.setAddress(storeForm.getAddress());
        store.setPhone(storeForm.getPhone());
        store.setStatus(storeForm.getStatus());

        return storeRepository.save(store);
    }

    @Override
    @Transactional
    public Integer deleteById(Integer id) {
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

        return id;
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

    @Override
    public List<StoreProductResponse> findProductsByStoreAndIsAdded(Integer storeId, Boolean isAdded) {
        Store store = findById(storeId);
        List<StoreProduct> productResponses = storeProductService.findAllByStore(store);

//        Return product added to store
        if (isAdded) {
            return productResponses.stream()
                    .map(storeProduct -> new StoreProductResponse(
                            storeProduct.getProduct(),
                            storeProduct.getQuantity()))
                    .collect(Collectors.toList());
        }

//        Get list of added product id
        List<Integer> productIds = productResponses.stream()
                .map(storeProduct -> storeProduct.getProduct().getId())
                .collect(Collectors.toList());

//        If list empty return all
        List<Product> products = productIds.size() == 0
                ? productRepository.findAll()
                : productRepository.findAllByIdIsNotIn(productIds);

        return products.stream()
                .filter(product -> product.getQuantity() > 0)
                .map(product -> new StoreProductResponse(product, product.getQuantity()))
                .collect(Collectors.toList());
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

    private boolean checkPermission(Store store) { //???
        Staff currentStaff = securityUtil.getCurrentStaff();
        return !currentStaff.isAdmin() &&
                !(currentStaff.getIsManager() && currentStaff.getStore().equals(store));
    }

}
