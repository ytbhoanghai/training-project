package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.exception.StaffNotFoundException;
import com.example.demo.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
