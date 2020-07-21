package com.example.demo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String name;

    private BigDecimal price;

    private Date createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Staff createdBy;

    @ManyToMany
    @JoinTable(
            name = "product_category",
            joinColumns = @JoinColumn(name = "id_product"),
            inverseJoinColumns = @JoinColumn(name = "id_category"))
    private Set<Category> categories;
}
