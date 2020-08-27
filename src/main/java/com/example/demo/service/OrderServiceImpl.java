package com.example.demo.service;

import com.example.demo.entity.Order;
import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.exception.OrderNotFoundException;
import com.example.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("orderService")
public class OrderServiceImpl implements OrderService {

    private OrderRepository orderRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public List<Order> findAllOrdersByStore(Store store) {
        return orderRepository.findAllByStore(store);
    }

    @Override
    public List<Order> findAllOrdersByStaff(Staff staff) {
        return orderRepository.findAllByStaff(staff);
    }

    @Override
    public Order findById(Integer id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }

    @Override
    public Order save(Order order) {
        return orderRepository.save(order);
    }

}
