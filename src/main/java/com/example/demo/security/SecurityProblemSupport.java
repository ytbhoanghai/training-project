package com.example.demo.security;

import com.example.demo.response.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

@Component
@Slf4j
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

        res.setContentType("application/json");
        int statusCode = HttpServletResponse.SC_UNAUTHORIZED;
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(new Date())
                .status(statusCode)
                .statusCode(HttpStatus.valueOf(statusCode).getReasonPhrase())
                .message(errMessage)
                .path(req.getRequestURI())
                .build();
        String errorJson = new ObjectMapper().writeValueAsString(error);
        res.setStatus(statusCode);
        res.getWriter().write(errorJson);
    }
}
