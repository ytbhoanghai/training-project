package com.example.demo.response;

import com.example.demo.entity.Product;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoreProductResponse extends Product {
    private Integer storeProductQuantity;

    public StoreProductResponse(Product product, Integer storeProductQuantity) {
        super(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getQuantity(),
                product.getCreatedAt(),
                null,
                product.getCategories()
        );
        this.storeProductQuantity = storeProductQuantity;
    }
}
