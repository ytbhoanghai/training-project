package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.exception.StaffNotFoundException;
import com.example.demo.repository.StaffRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service(value = "staffService")
public class StaffServiceImpl implements StaffService {

    private static final Logger LOGGER = LoggerFactory.getLogger(StaffServiceImpl.class);

    private StaffRepository staffRepository;

    @Autowired
    public StaffServiceImpl(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    @Override
    public Staff findStaffByUsername(String username) {
        Optional<Staff> optionalStaff = staffRepository.findByUsername(username);
        if (optionalStaff.isPresent()) {
            LOGGER.info("Find staff success by username: {}", username);
            return optionalStaff.get();
        } else {
            String message = StaffNotFoundException.getMessageForExceptionNotFoundByUsername(username);
            throw new StaffNotFoundException(message);
        }
    }
}
