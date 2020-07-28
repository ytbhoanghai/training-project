package com.example.demo.repository;

import com.example.demo.entity.Store;
import com.example.demo.entity.StoreProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreProductRepository extends JpaRepository<StoreProduct, Integer> {

    void deleteByStore(Store store);

}
