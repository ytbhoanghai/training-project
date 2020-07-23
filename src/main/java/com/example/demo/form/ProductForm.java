package com.example.demo.form;

import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.entity.Staff;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;

@Data
public class ProductForm {

    private String name;

    private BigDecimal price;

    Set<Integer> categories;

    public static Product buildProduct(ProductForm productForm, Staff createByStaff, Set<Category> categories) {
        return Product.builder()
                .name(productForm.getName())
                .price(productForm.getPrice())
                .createdAt(new Date())
                .createdBy(createByStaff)
                .categories(categories)
                .build();
    }
}
