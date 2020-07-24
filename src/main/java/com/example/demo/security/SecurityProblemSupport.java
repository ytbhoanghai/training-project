package com.example.demo.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;

@Component
public class SecurityProblemSupport implements AuthenticationEntryPoint, AccessDeniedHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityProblemSupport.class);

    @Override
    public void commence(HttpServletRequest req, HttpServletResponse res, AuthenticationException e)
            throws IOException {
        resolver(req, res, e);
    }

    @Override
    public void handle(HttpServletRequest req, HttpServletResponse res, AccessDeniedException e)
            throws IOException {
        resolver(req, res, e);
    }

    private void resolver(HttpServletRequest req, HttpServletResponse res, RuntimeException e) throws IOException {
        String errMessage = e.getMessage();
        if (e instanceof AuthenticationException) {
            LOGGER.error("Unauthorized error. Message - {}", errMessage);
        } else if (e instanceof AccessDeniedHandler) {
            LOGGER.error("Access Denied error. Message - {}", errMessage);
        }
        res.sendError(HttpServletResponse.SC_UNAUTHORIZED, errMessage);
    }
}
