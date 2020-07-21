package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.form.StaffForm;

import java.util.List;

public interface StaffService {

    Staff findStaffByUsername(String username);

    List<Staff> findAll();

    Staff findById(Integer id);

    Staff save(StaffForm staffForm);

    Staff update(Integer id, StaffForm staffForm);

    String delete(Integer id);

}
