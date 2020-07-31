package com.example.demo.repository;

import com.example.demo.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer> {
    Set<Permission> findAllByIdIsIn(Set<Integer> ids);

    Set<Permission> findByGrantable(Boolean grantable);

}
