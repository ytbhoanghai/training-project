package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.form.ProductForm;
import com.example.demo.response.MessageResponse;
import com.example.demo.security.constants.ProductPermission;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    private ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> findAll() {
        List<Product> products = productService.findAll();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/products/{productId}")
    @PreAuthorize("hasAuthority(\"" + ProductPermission.READ + "\")")
    public ResponseEntity<Product> findById(@PathVariable Integer productId) {
        Product product = productService.findById(productId);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PostMapping("/products")
    @PreAuthorize("hasAuthority(\"" + ProductPermission.CREATE + "\")")
    public ResponseEntity<Product> save(@Valid @RequestBody ProductForm productForm) {
        Product product = productService.save(productForm);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PutMapping("/products/{productId}")
    @PreAuthorize("hasAuthority(\"" + ProductPermission.UPDATE + "\")")
    public ResponseEntity<Product> update(@PathVariable Integer productId, @Valid @RequestBody ProductForm productForm) {
        Product product = productService.update(productId, productForm);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @DeleteMapping("/products/{productId}")
    @PreAuthorize("hasAuthority(\"" + ProductPermission.DELETE + "\")")
    public ResponseEntity<MessageResponse> delete(@PathVariable Integer productId) {
        productService.delete(productId);
        return new ResponseEntity<>(new MessageResponse("Deleted product with id: " + productId), HttpStatus.OK);
    }
}
