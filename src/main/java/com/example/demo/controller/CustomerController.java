package com.example.demo.controller;

import com.example.demo.form.CartItemUpdateForm;
import com.example.demo.form.PaymentForm;
import com.example.demo.response.CartItemResponse;
import com.example.demo.response.CartResponse;
import com.example.demo.response.MessageResponse;
import com.example.demo.response.ProductResponse;
import com.example.demo.service.CustomerService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/api/customer")
public class CustomerController {

    private CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping(value = "cart")
    public ResponseEntity<CartResponse> getMyCart() {
        return ResponseEntity.ok(customerService.getMyCart());
    }

    @PutMapping(value = "cart")
    public ResponseEntity<CartItemResponse> addCartItem(@RequestParam Integer productId, @RequestParam Integer quantity) {
        return ResponseEntity.ok(customerService.addCartItem(productId, quantity));
    }

    @PutMapping(value = "cart/cart-items")
    public ResponseEntity<List<Integer>> updateQuantityCartItems(@NotNull @RequestBody List<CartItemUpdateForm> itemUpdateForms) {
        return ResponseEntity.ok(customerService.updateQuantityCartItems(itemUpdateForms));
    }

    @DeleteMapping(value = "cart/cart-items/{idCartItem}")
    public ResponseEntity<MessageResponse> removeCartItem(@PathVariable Integer idCartItem) {
        customerService.removeCartItem(idCartItem);
        return ResponseEntity.ok(new MessageResponse("remove cart item success by id " + idCartItem));
    }

    @GetMapping(value = "stores/{storeId}/categories/{categoryId}/products")
    public ResponseEntity<List<ProductResponse>> findProductsByStoreAndCategory(@PathVariable Integer storeId, @PathVariable Integer categoryId) {
        List<ProductResponse> responses = customerService.findProductsByStoreAndCategory(storeId, categoryId);
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping(value = "cart/{cartId}")
    public ResponseEntity<MessageResponse> clearCart(@PathVariable Integer cartId) {
        customerService.clearCart(cartId);
        return ResponseEntity.ok(new MessageResponse("Clear cart successfully!"));
    }

    @PostMapping(value = "payment", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> checkOutPayment(@RequestBody PaymentForm paymentForm) throws StripeException {
        Charge charge = customerService.paymentCheckout(paymentForm);
        Map<String, String> response = new HashMap<>();
        response.put("charge_id", charge.getId());

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "orders")
    public ResponseEntity<?> findAllOrder() {
        return ResponseEntity.ok(customerService.findAllOrder());
    }
}
