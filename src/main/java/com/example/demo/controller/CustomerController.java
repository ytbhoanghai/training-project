package com.example.demo.controller;

import com.example.demo.form.CartItemUpdateForm;
import com.example.demo.response.MessageResponse;
import com.example.demo.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.List;

@Controller
@RequestMapping(value = "/api/customer")
public class CustomerController {

    private CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping(value = "cart")
    public ResponseEntity<?> getMyCart() {
        return ResponseEntity.ok(customerService.getMyCart());
    }

    @PutMapping(value = "cart")
    public ResponseEntity<?> addCartItem(@RequestParam Integer productId, @RequestParam Integer quantity) {
        return ResponseEntity.ok(customerService.addCartItem(productId, quantity));
    }

    @PutMapping(value = "cart/cart-items")
    public ResponseEntity<?> updateQuantityCartItems(@NotNull @RequestBody List<CartItemUpdateForm> itemUpdateForms) {
        return ResponseEntity.ok(customerService.updateQuantityCartItems(itemUpdateForms));
    }

    @DeleteMapping(value = "cart/{idCartItem}")
    public ResponseEntity<?> removeCartItem(@PathVariable Integer idCartItem) {
        customerService.removeCartItem(idCartItem);
        return ResponseEntity.ok(new MessageResponse("remove cart item success by id " + idCartItem));
    }


}
