package com.example.demo.controller;

import com.example.demo.entity.Staff;
import com.example.demo.exception.WrongOldPasswordException;
import com.example.demo.form.StaffForm;
import com.example.demo.form.UpdatePasswordForm;
import com.example.demo.response.AccountResponse;
import com.example.demo.response.MessageResponse;
import com.example.demo.security.SecurityUtil;
import com.example.demo.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.Map;
import java.util.List;

@ControllerAdvice
@RequestMapping(value = "/api/account")
@Validated
public class AccountController {

    private StaffService staffService;
    private SecurityUtil securityUtil;

    @Autowired
    public AccountController(StaffService staffService, SecurityUtil securityUtil) {
        this.staffService = staffService;
        this.securityUtil = securityUtil;
    }

    @GetMapping
    public ResponseEntity<?> getInfoAccount() {
        Staff staff = securityUtil.getCurrentStaff();
        return ResponseEntity.ok(AccountResponse.build(staff));
    }

    @GetMapping(value = "permissions")
    public ResponseEntity<?> getPermissionsOfCurrentStaff() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        return ResponseEntity.ok(staffService.getPermissionIdsOfCurrentStaff(currentStaff));
    }

    @PostMapping(value = "permissions")
    public ResponseEntity<?> checkPermissionsOfCurrentStaff(@RequestBody Map<String, List<String>> permissions) {
        return ResponseEntity.ok(staffService.checkPermissionsOfCurrentStaff(permissions));
    }

    @PostMapping
    public ResponseEntity<Staff> createAccountForCustomer(@Valid @RequestBody StaffForm staffForm) {
        Staff staff = StaffForm.buildStaff(staffForm, null, null, new HashSet<>(), 99, Staff.Type.CUSTOMER);
        return ResponseEntity.ok(staffService.save(staff));
    }

    @PutMapping
    public ResponseEntity<Staff> updateAccountForCustomer(@RequestBody StaffForm staffForm) {
        Staff staff = securityUtil.getCurrentStaff();
        staff.setName(staffForm.getName());
        staff.setAddress(staffForm.getAddress());
        return ResponseEntity.ok(staffService.save(staff));
    }

    @PutMapping("password")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordForm updatePasswordForm) {
        Staff currentStaff = securityUtil.getCurrentStaff();

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (!passwordEncoder.matches(updatePasswordForm.getOldPass(), currentStaff.getPassword())) {
            throw new WrongOldPasswordException();
        }
        currentStaff.setPassword(passwordEncoder.encode(updatePasswordForm.getNewPass()));

        staffService.save(currentStaff);
        return new ResponseEntity<>(new MessageResponse("Update password successfully"), HttpStatus.OK);
    }


}
