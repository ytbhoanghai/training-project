package com.example.demo.repository;

import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    List<Role> findAllByStore(Store store);

    @EntityGraph(value = "graph.Role.Staff-Permissions")
    Optional<Role> findById(Integer id);

    Optional<Role> findByIdAndStoreIsNotNull(Integer id);

    Optional<Role> findByIdAndStoreIsNull(Integer id);

    Set<Role> findAllByIdIsIn(Set<Integer> ids);

//    Exclude Root Admin from the query
    @Query("from Role r where r.grantable = ?1")
    List<Role> findAll(Boolean grantable);

//    Do not allowed to delete root admin account
    @Modifying
    @Query(value = "delete from Role r where r.grantable = true and r.id = :id")
    void deleteById(Integer id);

    List<Role> findAllByStoreIsNull();
}
