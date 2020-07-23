package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class RoleNotCreateByCurrentStaffException extends RuntimeException {
    public RoleNotCreateByCurrentStaffException() {
        super("Deleting failed. This role is not created by this staff!");
    }
}
