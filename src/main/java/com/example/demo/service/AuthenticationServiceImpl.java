package com.example.demo.service;

import com.example.demo.form.LoginForm;
import com.example.demo.response.JwtResponse;
import com.example.demo.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service(value = "authenticationService")
public class AuthenticationServiceImpl implements AuthenticationService {

    private UserDetailsService userDetailsService;
    private AuthenticationManager authenticationManager;
    private JwtProvider jwtProvider;

    @Autowired
    public AuthenticationServiceImpl(
            UserDetailsService userDetailsService,
            AuthenticationManager authenticationManager,
            JwtProvider jwtProvider) {

        this.userDetailsService = userDetailsService;
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
    }

    @Override
    public JwtResponse authenticate(LoginForm loginForm) {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginForm.getUsername(), loginForm.getPassword());

        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateJwtToken(authentication);
        return new JwtResponse(jwt);
    }
}
