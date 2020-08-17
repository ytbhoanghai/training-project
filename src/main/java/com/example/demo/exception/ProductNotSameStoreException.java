package com.example.demo.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@ResponseStatus(HttpStatus.CONFLICT)
public class ProductNotSameStoreException extends RuntimeException {
    public ProductNotSameStoreException(List<Integer> ids) throws JsonProcessingException {
        super(new ObjectMapper().writeValueAsString(ids));
    }
}
