package com.example.demo.repository;

import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {

    @EntityGraph(value = "graph.Staff.Roles")
    Optional<Staff> findByUsername(String username);

    List<Staff> findAllByStore(Store store);
}
