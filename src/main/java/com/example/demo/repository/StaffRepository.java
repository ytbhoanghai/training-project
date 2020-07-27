package com.example.demo.repository;

import com.example.demo.entity.Staff;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {

    @EntityGraph(value = "graph.Staff.Roles")
    Optional<Staff> findByUsername(String username);

    @Override
    @Modifying
//    1 means OTHER, 0 means ROOT_ADMIN
    @Query("delete from Staff s where s.type = 1 and s.id = :id")
    void deleteById(Integer id);
}
