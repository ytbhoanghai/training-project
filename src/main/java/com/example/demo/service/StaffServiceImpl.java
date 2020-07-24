package com.example.demo.service;

import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.exception.StaffNotFoundException;
import com.example.demo.exception.StoreNotFoundException;
import com.example.demo.exception.WrongOldPasswordException;
import com.example.demo.form.AddRoleToStaffForm;
import com.example.demo.form.StaffForm;
import com.example.demo.form.UpdatePasswordForm;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.StaffRepository;
import com.example.demo.repository.StoreRepository;
import com.example.demo.security.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service(value = "staffService")
public class StaffServiceImpl implements StaffService {

    private static final Logger LOGGER = LoggerFactory.getLogger(StaffServiceImpl.class);

    private StaffRepository staffRepository;
    private StoreRepository storeRepository;
    private RoleRepository roleRepository;
    private SecurityUtil securityUtil;

    @Autowired
    public StaffServiceImpl(
            StaffRepository staffRepository,
            SecurityUtil securityUtil,
            RoleRepository roleRepository,
            StoreRepository storeRepository) {
        this.staffRepository = staffRepository;
        this.securityUtil = securityUtil;
        this.roleRepository = roleRepository;
        this.storeRepository = storeRepository;
    }

    @Override
    public Staff findByUsername(String username) {
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
        Staff createByStaff = findByUsername(securityUtil.getCurrentPrincipal().getUsername());
        Staff newStaff = StaffForm.buildStaff(staffForm, createByStaff, ofStore);
//        Hash password and save to the object
        newStaff.setPassword(new BCryptPasswordEncoder().encode(staffForm.getPassword()));
        return staffRepository.save(newStaff);
    }

    @Override
    public Staff addRoleToStaff(AddRoleToStaffForm addRoleToStaffForm) {
        Staff staff = findById(addRoleToStaffForm.getStaffId());
        Set<Role> roles = roleRepository.findAllByIdIsIn(addRoleToStaffForm.getRoleIds());
        return staffRepository.save(Staff.updateRole(staff, roles));
    }

    @Override
    public Staff update(Integer id, StaffForm staffForm) {
        Staff staff = findById(id);
        return staffRepository.save(Staff.updateData(staff, staffForm));
    }

    @Override
    public boolean updatePassword(UpdatePasswordForm updatePasswordForm) {
        Staff currentStaff = findByUsername(securityUtil.getCurrentPrincipal().getUsername());
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
