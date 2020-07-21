package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.exception.StaffNotFoundException;
import com.example.demo.form.StaffForm;
import com.example.demo.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service(value = "staffService")
public class StaffServiceImpl implements StaffService {

    private StaffRepository staffRepository;

    @Autowired
    public StaffServiceImpl(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    @Override
    public Staff findStaffByUsername(String username) {
        return staffRepository.findByUsername(username)
                .orElseThrow(() -> {
                    String message = StaffNotFoundException.getMessageForExceptionNotFoundByUsername(username);
                    return new StaffNotFoundException(message);
                });
    }

    @Override
    public List<Staff> findAll() {
        return staffRepository.findAll();
    }

    @Override
    public Staff findById(Integer id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new StaffNotFoundException(id));
    }

    @Override
    public Staff save(StaffForm staffForm) {
        return staffRepository.save(StaffForm.buildStaff(staffForm));
    }

    @Override
    public Staff update(Integer id, StaffForm staffForm) {
        Staff staff = findById(id);
        return null;
    }

    @Override
    public String delete(Integer id) {
        return null;
    }
}
