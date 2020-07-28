package com.example.demo.controller;

import com.example.demo.form.LoginForm;
import com.example.demo.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@ControllerAdvice
@RequestMapping("/api/authenticate")
public class AuthenticationController {

    private AuthenticationService authenticationService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping
    public ResponseEntity<?> authenticate(@Valid @RequestBody LoginForm loginForm) {

        return ResponseEntity
                .ok(authenticationService.authenticate(loginForm));
    }

}
