package com.example.demo.response;

import com.example.demo.entity.Cart;
import com.example.demo.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private Integer id;
    private Date createdAt;
    private List<CartItemResponse> cartItems;

    public static CartResponse build(Cart cart, List<CartItem> cartItems) {
        return new CartResponse(
                cart.getId(),
                cart.getCreatedAt(),
                cartItems.stream()
                        .map(CartItemResponse::build)
                        .collect(Collectors.toList())
        );
    }


}
