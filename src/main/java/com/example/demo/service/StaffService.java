package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.form.StaffForm;
import com.example.demo.form.UpdatePasswordForm;
import com.example.demo.response.StaffResponse;

import java.util.List;

public interface StaffService {

    Staff findByUsername(String username);

    List<Staff> findAllByStore(Store store);

    List<StaffResponse> findAll();

    Staff findById(Integer id);

    Staff save(StaffForm staffForm);

    List<Staff> saveAll(List<Staff> staff);

    Staff update(Integer id, StaffForm staffForm);

    boolean updatePassword(UpdatePasswordForm updatePasswordForm);

    String deleteById(Integer id);

}
