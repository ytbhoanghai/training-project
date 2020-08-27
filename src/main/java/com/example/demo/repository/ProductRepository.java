package com.example.demo.repository;

import com.example.demo.entity.Product;
import com.example.demo.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Override
    @EntityGraph(value = "graph.Product.categories")
    Optional<Product> findById(Integer integer);

    Optional<Product> findByIdAndStore(Integer id, Store store);

    Set<Product> findAllByIdIsIn(Set<Integer> ids);

    List<Product> findAllByIdIsNotIn(List<Integer> ids);

    List<Product> findAllByStore(Store store);

    Page<Product> findAllByStoreAndNameContains(Store store, String term, Pageable pageable);

    Page<Product> findAllByStoreAndCategoriesIsContainingAndNameContains(Store store, Category category, String term, Pageable pageable);

    Page<Product> findAllByStoreAndCategoriesIsContaining(Store store, Category category, Pageable pageable);

}
