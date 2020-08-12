package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.form.StaffForm;
import com.example.demo.form.UpdatePasswordForm;
import com.example.demo.response.StaffResponse;

import java.util.List;
import java.util.Set;

public interface StaffService {

    List<StaffResponse> findAll();

    List<Staff> findAllByStore(Store store);

    List<Staff> findAllByStoreAndIsManager(Store store, Boolean isManager);

    List<Staff> findAllByIdIsIn(Set<Integer> ids);

    List<Staff> saveAll(List<Staff> staff);

    Staff findByUsername(String username);

    Staff findById(Integer id);

    Staff save(StaffForm staffForm);

    Staff save(Staff staff);

    Staff update(Integer id, StaffForm staffForm);

    String deleteById(Integer id);

    List<Integer> getPermissionIdsOfCurrentStaff(Staff currentStaff);

    List<Staff> findAllByStoreIsNull();

}
