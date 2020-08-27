package com.example.demo.controller.ui;

import com.example.demo.entity.Order;

import java.util.List;

public interface IOrder {

    List<Order> findAllOrders();

    Order findOrderById(Integer id);

    Order changeStatusOrder(Integer id, Order.Status status);

}
