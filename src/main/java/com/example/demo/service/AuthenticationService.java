package com.example.demo.service;

import com.example.demo.form.LoginForm;
import com.example.demo.response.JwtResponse;

public interface AuthenticationService {

    JwtResponse authenticate(LoginForm loginForm);

}
