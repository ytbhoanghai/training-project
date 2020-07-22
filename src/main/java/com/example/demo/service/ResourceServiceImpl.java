package com.example.demo.service;

import com.example.demo.entity.Permission;
import com.example.demo.entity.Resource;
import com.example.demo.repository.ResourceRepository;
import com.example.demo.response.ResourceResponse;
import com.example.demo.service.ResourceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class ResourceServiceImpl implements ResourceService {

    private ResourceRepository resourceRepository;

    @Autowired
    public ResourceServiceImpl(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Override
    public List<ResourceResponse> findAll() {
        List<Resource> resourceList = resourceRepository.findAll();
        List<ResourceResponse> resourceResponses = new ArrayList<>();
//        Create a new ResourceResponse from Resource
        resourceList.stream().forEach(resource -> {
            resourceResponses.add(ResourceResponse.from(resource));
        });
        return resourceResponses;
    }

}
