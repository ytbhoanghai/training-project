package com.example.demo.repository;

import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {

    @EntityGraph(value = "graph.Staff.Roles")
    @Query("from Staff s where s.username = ?1 and s.isDeleted = false")
    Optional<Staff> findByUsername(String username);

    @Query("from Staff s where s.isDeleted = false and s.id = ?1 and s.type = ?2")
    Optional<Staff> findByIdAndType(Integer id, Staff.Type type);

    @Query("from Staff s where s.store = ?1 and s.isDeleted = false and s.type = 1")
    List<Staff> findAllByStore(Store store);

    @Query("from Staff s where s.store = ?1 and s.isManager = ?2 and s.isDeleted = false and s.type = 1")
    List<Staff> findAllByStoreAndIsManager(Store store, Boolean isManager);

    @Query("from Staff s where s.id in ?1 and s.isDeleted = false and s.type = 1")
    List<Staff> findAllByIdIsIn(Set<Integer> ids);

    @Query("from Staff s where s.createdBy = ?1 and s.isDeleted = false")
    List<Staff> findAllByCreatedBy(Staff staff);

    @Query("from Staff s where s.isDeleted = false and s.type = 1")
    List<Staff> findAll();

    @Query("from Staff s where s.store is null and s.isDeleted = false and s.level <> 0 and s.type = 1")
    List<Staff> findAllByStoreIsNull();

    @Query("from Staff s where s.isDeleted = false and s.type = ?1")
    List<Staff> findAllAndType(Staff.Type type);
}
