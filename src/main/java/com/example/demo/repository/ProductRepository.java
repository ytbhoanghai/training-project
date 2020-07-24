package com.example.demo.repository;

import com.example.demo.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Override
    @EntityGraph(value = "graph.Product.categories")
    Optional<Product> findById(Integer integer);

    Set<Product> findAllByIdIsIn(Set<Integer> ids);

}
