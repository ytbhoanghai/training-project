package com.example.demo.exception.handler;

import com.example.demo.exception.WrongOldPasswordException;
import com.example.demo.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

//    @ExceptionHandler(WrongOldPasswordException.class)
//    public ResponseEntity<?> handleWrongOldPassword() {
//        ErrorResponse error = new ErrorResponse();
//        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
//    }

}
