package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.form.CartItemMergeForm;
import com.example.demo.form.CartItemUpdateForm;
import com.example.demo.form.PaymentForm;
import com.example.demo.response.CartItemResponse;
import com.example.demo.response.CartResponse;
import com.example.demo.response.MessageResponse;
import com.example.demo.response.PageableProductResponse;
import com.example.demo.security.constants.StorePermission;
import com.example.demo.service.CustomerService;
import com.example.demo.service.OrderUpdateForm;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/customer")
@Validated
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
    public ResponseEntity<CartItemResponse> addCartItem(@RequestParam Integer storeId, @RequestParam Integer productId, @Valid @RequestParam @Min(value = 1) Integer quantity) throws JsonProcessingException {
        return ResponseEntity.ok(customerService.addCartItem(storeId, productId, quantity));
    }

    @PutMapping(value = "cart/cart-items")
    public ResponseEntity<List<Integer>> updateQuantityCartItems(@Valid @NotNull @RequestBody List<CartItemUpdateForm> cartItemUpdateForms) {
        return ResponseEntity.ok(customerService.updateQuantityCartItems(cartItemUpdateForms));
    }

    @PutMapping(value = "cart/cart-items/merge")
    public ResponseEntity<List<Integer>> mergeCart(@Valid @RequestBody List<CartItemMergeForm> cartItemMergeForms) throws JsonProcessingException {
        return ResponseEntity.ok(customerService.mergeCart(cartItemMergeForms));
    }

    @DeleteMapping(value = "cart/cart-items/{idCartItem}")
    public ResponseEntity<MessageResponse> removeCartItem(@PathVariable Integer idCartItem) {
        customerService.removeCartItem(idCartItem);
        return ResponseEntity.ok(new MessageResponse("remove cart item success by id " + idCartItem));
    }

//    @GetMapping(value = "stores/{storeId}/categories/{categoryId}/products/search")
//    public ResponseEntity<PageableProductResponse> searchProducts(
//            @PathVariable Integer storeId, @PathVariable Integer categoryId,
//            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
//            @RequestParam(name = "size", required = false, defaultValue = "6") Integer size,
//            @RequestParam(name = "search", required = false, defaultValue = "") String keyword) {
//
////        Page starts from 0
//        Pageable pageable = PageRequest.of(page - 1, size);
//        PageableProductResponse responses = customerService.searchProducts(storeId, categoryId, pageable, keyword);
//        return ResponseEntity.ok(responses);
//    }

    @GetMapping(value = "stores/{storeId}/categories/{categoryId}/products")
    public ResponseEntity<PageableProductResponse> findProductsByStoreAndCategory(
            @PathVariable Integer storeId, @PathVariable Integer categoryId,
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "size", required = false, defaultValue = "6") Integer size,
            @RequestParam(name = "search", required = false, defaultValue = "") String keyword
    ) {
        /* Page starts from 0 */
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        PageableProductResponse responses =
                customerService.searchProducts(storeId, categoryId, pageable, keyword.trim());
        /* customerService.findProductsByStoreAndCategory(storeId, categoryId, pageable); */
        return ResponseEntity.ok(responses);
    }

    @Deprecated
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
    public ResponseEntity<List<Order>> findAllOrderByCurrentStaff() {
        return ResponseEntity.ok(customerService.findAllOrder());
    }

    @PutMapping(value = "orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Integer id, @RequestBody OrderUpdateForm orderUpdateForm) {
        return ResponseEntity.ok(customerService.updateOrderStatus(id, orderUpdateForm));
    }

    @GetMapping(value = "orders/stores/{storeId}")
    @PreAuthorize(value = "hasAuthority(\"" + StorePermission.READ + "\")")
    public ResponseEntity<List<Order>> findAllOrdersByStore(@PathVariable Integer storeId) {
        return ResponseEntity.ok(customerService.findAllOrdersByStore(storeId));
    }

}
