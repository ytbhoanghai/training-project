package com.example.demo.repository;

import com.example.demo.entity.Staff;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {

    @EntityGraph(value = "graph.Staff.Roles")
    Optional<Staff> findByUsername(String username);
}
