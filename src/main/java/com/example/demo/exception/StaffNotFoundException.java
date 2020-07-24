package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class StaffNotFoundException extends RuntimeException {

    private static final String MESSAGE_FOR_EXCEPTION_NOT_FOUND_BY_USERNAME = "Staff not found by username %s";

    public StaffNotFoundException(String message) {
        super(message);
    }

    public StaffNotFoundException(Integer id) {
        super("Staff Not Found By ID " + id);
    }

    public static String getMessageForExceptionNotFoundByUsername(String username) {
        return String.format(MESSAGE_FOR_EXCEPTION_NOT_FOUND_BY_USERNAME, username);
    }

}
