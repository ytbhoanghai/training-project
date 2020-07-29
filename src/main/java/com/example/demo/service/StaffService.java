package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.form.StaffForm;
import com.example.demo.form.UpdatePasswordForm;
import com.example.demo.response.StaffResponse;

import java.util.List;

public interface StaffService {

    List<StaffResponse> findAll();

    List<Staff> findAllByStore(Store store);

    List<Staff> saveAll(List<Staff> staff);

    Staff findByUsername(String username);

    Staff findById(Integer id);

    Staff save(StaffForm staffForm);

    Staff update(Integer id, StaffForm staffForm);

    String deleteById(Integer id);

    List<Integer> getPermissionIdsOfCurrentStaff(Staff currentStaff);

    boolean updatePassword(UpdatePasswordForm updatePasswordForm);

}
