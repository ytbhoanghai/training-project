package com.example.demo.form;

import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Set;

@Data
public class AddProductToStoreForm {

    @NotNull
    private Integer storeId;

    @NotNull
    private Integer productId;

    @NotNull
    private Integer quantity;

}
