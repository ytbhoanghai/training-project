package com.example.demo.form;

import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;

@Data
public class ProductForm {

    @NotNull
    private String name;

    private BigDecimal price;

    private Integer quantity;

    private Integer storeId;

    Set<Integer> categories;

    public static Product buildProduct(
            ProductForm productForm, Store store, Staff createByStaff, Set<Category> categories
    ) {
        return Product.builder()
                .name(productForm.getName())
                .price(productForm.getPrice())
                .quantity(productForm.getQuantity())
                .store(store)
                .createdAt(new Date())
                .createdBy(createByStaff)
                .categories(categories).build();
    }
}
