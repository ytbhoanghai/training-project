package com.example.demo.controller;

import com.example.demo.entity.Resource;
import com.example.demo.response.ResourceResponse;
import com.example.demo.service.ResourceServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private ResourceServiceImpl resourceService;

    @Autowired
    public ResourceController(ResourceServiceImpl resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponse>> findAllResourcesWithPermissions() {
        List<ResourceResponse> resourceList = resourceService.findAll();
        return new ResponseEntity<>(resourceList, HttpStatus.OK);
    }
}
