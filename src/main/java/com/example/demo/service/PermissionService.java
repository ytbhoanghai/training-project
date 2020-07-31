package com.example.demo.service;

import com.example.demo.entity.Permission;

import java.util.Set;

public interface PermissionService {

    Set<Permission> findAllByIdIsIn(Set<Integer> ids);

    Set<Permission> findByGrantable(Boolean grantable);

}
