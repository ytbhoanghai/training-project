package com.example.demo.response;

import com.example.demo.entity.Category;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class SimpleCategoryResponse {

    private Integer id;

    private String name;

    private String description;

    private Date createdAt;

    public static SimpleCategoryResponse from(Category category) {
        return SimpleCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .build();
    }
}
