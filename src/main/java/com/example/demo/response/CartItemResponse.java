package com.example.demo.response;

import com.example.demo.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {

    private Integer id;
    private String name;
    private Integer price;
    private Integer quantity;

    public static CartItemResponse build(CartItem cartItem) {
        return new CartItemResponse(
                cartItem.getId(),
                cartItem.getProduct().getName(),
                cartItem.getProduct().getQuantity(),
                cartItem.getQuantity());
    }

}
