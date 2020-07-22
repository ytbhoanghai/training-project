package com.example.demo.exception;

public class RoleNotFoundException extends RuntimeException {
    public RoleNotFoundException(Integer id) {
        super("Role Not Found By ID " + id);
    }
}
