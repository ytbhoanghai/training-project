package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.exception.StaffNotFoundException;
import com.example.demo.exception.StoreNotFoundException;
import com.example.demo.exception.WrongOldPasswordException;
import com.example.demo.form.StaffForm;
import com.example.demo.form.UpdatePasswordForm;
import com.example.demo.repository.StaffRepository;
import com.example.demo.repository.StoreRepository;
import com.example.demo.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service(value = "staffService")
public class StaffServiceImpl implements StaffService {

    private StaffRepository staffRepository;
    private StoreRepository storeRepository;
    private SecurityUtil securityUtil;

    @Autowired
    public StaffServiceImpl(StaffRepository staffRepository, SecurityUtil securityUtil, StoreRepository storeRepository) {
        this.staffRepository = staffRepository;
        this.securityUtil = securityUtil;
        this.storeRepository = storeRepository;
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
//        Get store from input id
        Store ofStore = storeRepository.findById(staffForm.getStoreId())
                .orElseThrow(() -> new StoreNotFoundException(staffForm.getStoreId()));

//        Get current login staff and save
        Staff createByStaff = findStaffByUsername(securityUtil.getCurrentPrincipal().getUsername());
        Staff newStaff = StaffForm.buildStaff(staffForm, createByStaff, ofStore);
//        Hash password and save to the object
        newStaff.setPassword(new BCryptPasswordEncoder().encode(staffForm.getPassword()));
        return staffRepository.save(newStaff);
    }

    @Override
    public Staff update(Integer id, StaffForm staffForm) {
        Staff staff = findById(id);
        return staffRepository.save(Staff.updateData(staff, staffForm));
    }

    @Override
    public boolean updatePassword(UpdatePasswordForm updatePasswordForm) {
        Staff currentStaff = findStaffByUsername(securityUtil.getCurrentPrincipal().getUsername());
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        Throw Error if password doesn't match
        if (!passwordEncoder.matches(updatePasswordForm.getOldPass(), currentStaff.getPassword())) {
            throw new WrongOldPasswordException();
        }
//        Set new hashed password to user
        currentStaff.setPassword(passwordEncoder.encode(updatePasswordForm.getNewPass()));
        staffRepository.save(currentStaff);
        return true;
    }

    @Override
    public String deleteById(Integer id) {
        try {
            staffRepository.deleteById(id);
        } catch (EmptyResultDataAccessException e) {
            throw new StaffNotFoundException(id);
        }
        return String.valueOf(id);
    }
}
