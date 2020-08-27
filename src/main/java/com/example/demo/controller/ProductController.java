package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.form.ProductForm;
import com.example.demo.repository.ProductRepository;
import com.example.demo.response.MessageResponse;
import com.example.demo.security.constants.ProductPermission;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@Validated
public class ProductController {

    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<?> findAll(
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "-1") Integer size) {

        if (page == 0 && size == -1) {
            return ResponseEntity.ok(productService.findAll());
        }
        return ResponseEntity.ok(productService.findAll(page, size));
    }

    @GetMapping("{productId}")
    @PreAuthorize("hasAuthority(\"" + ProductPermission.READ + "\")")
    public ResponseEntity<Product> findById(@PathVariable Integer productId) {
        Product product = productService.findById(productId);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAuthority(\"" + ProductPermission.CREATE + "\")")
    public ResponseEntity<Product> save(@Valid @RequestBody ProductForm productForm) {
        Product product = productService.save(productForm);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PutMapping("{productId}")
    @PreAuthorize("hasAuthority(\"" + ProductPermission.UPDATE + "\")")
    public ResponseEntity<Product> update(@PathVariable Integer productId, @Valid @RequestBody ProductForm productForm) {
        Product product = productService.update(productId, productForm);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @DeleteMapping("{productId}")
    @PreAuthorize("hasAuthority(\"" + ProductPermission.DELETE + "\")")
    public ResponseEntity<MessageResponse> delete(@PathVariable Integer productId) {
        productService.delete(productId);
        return new ResponseEntity<>(new MessageResponse("Deleted product with id: " + productId), HttpStatus.OK);
    }

}
