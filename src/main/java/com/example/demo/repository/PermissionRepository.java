package com.example.demo.repository;

import com.example.demo.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface PermissionRepository extends JpaRepository<Permission, Integer> {
    Set<Permission> findAllByIdIsIn(Set<Integer> ids);
}
