package com.example.demo.repository;

import com.example.demo.entity.Role;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    @EntityGraph(value = "graph.Role.Staff-Permissions")
    Optional<Role> findById(Integer id);

    Role findRoleByName(String name);

}
