package com.example.demo.service;

import com.example.demo.entity.Permission;
import com.example.demo.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service(value = "permissionService")
public class PermissionServiceImpl implements PermissionService {

    private PermissionRepository permissionRepository;

    @Autowired
    public PermissionServiceImpl(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @Override
    public Set<Permission> findAllByIdIsIn(Set<Integer> ids) {
        return permissionRepository.findAllByIdIsIn(ids);
    }

    @Override
    public Set<Permission> findByGrantable(Boolean grantable) {
        return permissionRepository.findByGrantable(grantable);
    }
}
