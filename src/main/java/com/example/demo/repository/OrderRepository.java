package com.example.demo.repository;

import com.example.demo.entity.Order;
import com.example.demo.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findAllByStaff(Staff staff);

}
