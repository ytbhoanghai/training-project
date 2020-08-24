package com.example.demo.form;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemUpdateForm {

    private Integer idCartItem;
    @Min(value = 1)
    private Integer quantity;

}
