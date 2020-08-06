package com.example.demo.controller;

import com.example.demo.form.CartItemUpdateForm;
import com.example.demo.form.PaymentForm;
import com.example.demo.response.CartItemResponse;
import com.example.demo.response.CartResponse;
import com.example.demo.response.MessageResponse;
import com.example.demo.response.ProductResponse;
import com.example.demo.service.CustomerService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.param.ExchangeRateListParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/api/customer")
public class CustomerController {

    private CustomerService customerService;
    @Value("${stripe.private.key}")
    private String stripeSecretKey;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
        Stripe.apiKey = "sk_test_K5pzvFYKGyl5wMuVKas8ZPzM00wspbHd4T";
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

    @PostMapping(value = "payment")
    public ResponseEntity<Charge> checkoutPayment(@RequestBody PaymentForm paymentForm) throws StripeException {
        Map<String, Object> chargeParams = new HashMap<>();
        chargeParams.put("amount", 120*10);
        chargeParams.put("currency", "USD");
        chargeParams.put("source", paymentForm.getToken());
        Charge charge = Charge.create(chargeParams);
        System.out.println(charge);
        return ResponseEntity.ok(charge);
    }
}