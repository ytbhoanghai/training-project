package com.example.demo.form;

import com.example.demo.entity.Category;
import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;

@Data
public class CategoryForm {

    @NotBlank
    @NotNull
    @Size(min = 2)
    private String name;

    private String description;

    private Integer storeId;

    public static Category buildCategory(CategoryForm categoryForm, Store store, Staff createByStaff) {
        return Category.builder()
                .name(categoryForm.getName())
                .store(store)
                .description(categoryForm.getDescription())
                .createdAt(new Date())
                .createdBy(createByStaff).build();
    }
}
