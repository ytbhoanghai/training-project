package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
public class PermissionInvalidException extends RuntimeException {
    public PermissionInvalidException(String message) {
        super(message);
    }
}
