package com.example.demo.controller.ui;

import com.example.demo.entity.Staff;
import com.example.demo.form.StaffForm;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.Valid;
import java.util.List;

@Transactional
public interface IStaff {

    List<Staff> findAllStaffs();

    Staff findStaffById(Integer id);

    Staff updateStaff(Integer id, @Valid StaffForm staffForm);

    Integer deleteStaffById(Integer id);

    Staff createStaff(@Valid StaffForm staffForm);

}
