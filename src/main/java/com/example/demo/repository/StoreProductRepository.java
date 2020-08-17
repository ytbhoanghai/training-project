package com.example.demo.repository;

import com.example.demo.entity.Product;
import com.example.demo.entity.Store;
import com.example.demo.entity.StoreProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreProductRepository extends JpaRepository<StoreProduct, StoreProduct.StoreProductID> {

    Page<StoreProduct> findAllByStore(Store store, Pageable pageable);

    List<StoreProduct> findAllByStore(Store store);

    List<StoreProduct> findAllByProduct(Product product);

    void deleteByStore(Store store);

    List<StoreProduct> findAllByProductIsNotIn(List<Product> products);

    @Modifying
    @Query("delete from StoreProduct sp where sp.id = ?1")
    void deleteById(StoreProduct.StoreProductID id);
}
