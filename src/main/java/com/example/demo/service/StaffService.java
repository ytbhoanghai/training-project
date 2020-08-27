package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.form.StaffForm;
import com.example.demo.form.StoreForm;
import com.example.demo.form.UpdatePasswordForm;
import com.example.demo.response.StaffResponse;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface StaffService {

    List<StaffResponse> findAllAndConventToResponse();

    List<Staff> findAllByStore(Store store);

    List<Staff> findAllAndType(Staff.Type type);

    List<Staff> findAllByStoreAndIsManager(Store store, Boolean isManager);

    List<Staff> findAllByIdIsIn(Set<Integer> ids);

    List<Staff> saveAll(List<Staff> staff);

    Staff findByUsername(String username);

    Staff findByIdAndType(Integer id, Staff.Type type);

    Staff save(StaffForm staffForm);

    Staff save(Staff staff);

    Staff update(Integer id, StaffForm staffForm);

    Integer deleteById(Integer id);

    List<Integer> getPermissionIdsOfCurrentStaff(Staff currentStaff);

    Staff findById(Integer id);

    List<Staff> findAllByStoreIsNull();

    Map<String, List<String>> checkPermissionsOfCurrentStaff(Map<String, List<String>> permissions);

    Boolean isAllowedUpdate(Staff staff, Staff currentStaff);

    Boolean isAllowedUpdateRole(Staff staff, Staff currentStaff);

    Boolean isAllowedDelete(Staff staff, Staff currentStaff);

    Staff createAccountManagerForStore(Staff createdBy, Store store, StoreForm storeForm);
}
