package com.example.demo.form;

import com.example.demo.entity.Category;
import com.example.demo.entity.Staff;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    public static Category buildCategory(CategoryForm categoryForm, Staff createByStaff) {
        return Category.builder()
                .name(categoryForm.getName())
                .createdAt(new Date())
                .createdBy(createByStaff)
                .build();
    }
}
