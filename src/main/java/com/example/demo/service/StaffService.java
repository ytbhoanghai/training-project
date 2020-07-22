package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.form.StaffForm;
import com.example.demo.form.UpdatePasswordForm;

import java.util.List;

public interface StaffService {

    Staff findStaffByUsername(String username);

    List<Staff> findAll();

    Staff findById(Integer id);

    Staff save(StaffForm staffForm);

    Staff update(Integer id, StaffForm staffForm);

    boolean updatePassword(UpdatePasswordForm updatePasswordForm);

    String deleteById(Integer id);

}
