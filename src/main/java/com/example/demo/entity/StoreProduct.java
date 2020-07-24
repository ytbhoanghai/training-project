package com.example.demo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "store_product")
public class StoreProduct {

    @EmbeddedId
    private StoreProductID id;

    private Integer quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_store")
    @MapsId(value = "idStore")
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_product")
    @MapsId(value = "idProduct")
    private Product product;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class StoreProductID implements Serializable {
        private Integer idProduct;
        private Integer idStore;
    }

    public static StoreProduct addProductToStore(Store store, Product product, Integer quantity) {
        StoreProductID id = new StoreProductID(product.getId(), store.getId());
        StoreProduct storeProduct = StoreProduct.builder()
                .id(id)
                .store(store)
                .product(product)
                .quantity(quantity)
                .build();
        return storeProduct;
    }
}
