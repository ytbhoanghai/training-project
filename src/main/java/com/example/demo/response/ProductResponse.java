package com.example.demo.response;

import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.entity.StoreProduct;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Integer id;
    private String name;
    private BigDecimal price;
    private Integer quantity;
    private List<String> categoryNames;
    private Date createdAt;
    private String storeName;

    public static ProductResponse build(Product product) {
        List<String> categoryNames = product.getCategories().stream()
                .map(Category::getName)
                .collect(Collectors.toList());

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .categoryNames(categoryNames)
                .createdAt(product.getCreatedAt())
                .storeName("").build();
    }

    public static ProductResponse build(StoreProduct storeProduct, String storeName) {
        Product product = storeProduct.getProduct();
        List<String> categoryNames = product.getCategories().stream()
                .map(Category::getName)
                .collect(Collectors.toList());

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .quantity(storeProduct.getQuantity())
                .categoryNames(categoryNames)
                .createdAt(product.getCreatedAt())
                .storeName(storeName).build();
    }

}
