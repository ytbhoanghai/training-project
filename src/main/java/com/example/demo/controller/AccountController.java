package com.example.demo.controller;

import com.example.demo.entity.Staff;
import com.example.demo.response.AccountResponse;
import com.example.demo.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;

@ControllerAdvice
@RequestMapping(value = "/api")
public class AccountController {

    private StaffService staffService;

    @Autowired
    public AccountController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping(value = "account")
    public ResponseEntity<?> getInfoAccount(Principal principal) {
        String username = principal.getName();
        Staff staff = staffService.findByUsername(username);
        return ResponseEntity.ok(AccountResponse.build(staff));
    }

}
