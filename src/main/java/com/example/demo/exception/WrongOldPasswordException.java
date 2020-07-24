package com.example.demo.exception;

public class WrongOldPasswordException extends RuntimeException {

    public WrongOldPasswordException() {
        super("Wrong old password. Please try again");
    }
}
