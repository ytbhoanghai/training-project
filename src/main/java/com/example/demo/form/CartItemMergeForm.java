package com.example.demo.form;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemMergeForm {

    @NotNull
    private Integer productId;
    @Min(1)
    private Integer quantity;
    @NotNull
    private Integer storeId;

}
