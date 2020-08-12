package com.example.demo.service;

import com.example.demo.entity.Order;
import lombok.Data;

@Data
public class OrderUpdateForm {
    private Order.Status status;
}
