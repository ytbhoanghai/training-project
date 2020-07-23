package com.example.demo.repository;

import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    @Override
    @EntityGraph(value = "graph.Role.Staff-Permissions")
    Optional<Role> findById(Integer id);

    Optional<Role> findByIdAndCreatedBy(Integer roleId, Staff staff);

    Set<Role> findAllByIdIsIn(Set<Integer> ids);

//    Exclude Root Admin from the query
    @Override
    @Query("from Role r where r.grantable = true")
    List<Role> findAll();

//    Do not allowed to delete root admin account
    @Override
    @Modifying
    @Query(value = "delete from Role r where r.grantable = true and r.id = :id")
    void deleteById(Integer id);

    void deleteRoleByIdAndCreatedBy(Integer roleId, Integer staffId);

}
