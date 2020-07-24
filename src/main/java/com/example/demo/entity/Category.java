package com.example.demo.entity;

import com.example.demo.form.CategoryForm;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "category")
@NamedEntityGraph(name = "graph.Category.createdBy",
    attributeNodes = { @NamedAttributeNode("createdBy") })
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private Date createdAt;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Staff createdBy;

    public static Category updateDate(Category category, CategoryForm categoryForm) {
        category.setName(categoryForm.getName());
        return category;
    }
}
