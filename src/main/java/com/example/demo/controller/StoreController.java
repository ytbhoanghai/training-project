package com.example.demo.controller;

import com.example.demo.entity.Store;
import com.example.demo.form.StoreForm;
import com.example.demo.response.MessageResponse;
import com.example.demo.security.constants.StorePermission;
import com.example.demo.service.StoreServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/stores")
@Slf4j
public class StoreController {

    private StoreServiceImpl storeService;

    @Autowired
    public StoreController(StoreServiceImpl storeService) {
        this.storeService = storeService;
    }

    @GetMapping
//    @PreAuthorize("hasAuthority(\"" + StorePermission.READ + "\")")
    public ResponseEntity<List<Store>> findAll() {
        System.out.println();
        List<Store> stores = storeService.findAll();
        return new ResponseEntity<>(stores, HttpStatus.OK);
    }

    @GetMapping("{storeId}")
    @PreAuthorize("hasAuthority(\"" + StorePermission.READ + "\")")
    public ResponseEntity<Store> findById(@PathVariable Integer storeId) {
        Store store = storeService.findById(storeId);
        return new ResponseEntity<>(store, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAuthority(\"" + StorePermission.CREATE + "\")")
    public ResponseEntity<Store> createStore(@Valid @RequestBody StoreForm storeForm) {
        log.info(storeForm.toString());
        Store store = storeService.save(storeForm);
        return new ResponseEntity<>(store, HttpStatus.OK);
    }

    @PutMapping("{storeId}/products/{productId}")
    public ResponseEntity<?> addProductToStore(@PathVariable Integer storeId, @PathVariable Integer productId, @RequestParam Integer quantity) {
        storeService.addProductToStore(storeId, productId, quantity);
        return new ResponseEntity<>(new MessageResponse("Add product to store successfully!"), HttpStatus.OK);
    }

    @PutMapping("{storeId}")
    @PreAuthorize("hasAuthority(\"" + StorePermission.UPDATE + "\")")
    public ResponseEntity<Store> updateStore(@PathVariable Integer storeId, @Valid @RequestBody StoreForm storeForm) {
        Store store = storeService.update(storeId, storeForm);
        return new ResponseEntity<>(store, HttpStatus.OK);
    }

    @DeleteMapping("{storeId}")
    @PreAuthorize("hasAuthority(\"" + StorePermission.DELETE + "\")")
    public ResponseEntity<?> deleteStore(@PathVariable Integer storeId) {
        String id = storeService.deleteById(storeId);
        return new ResponseEntity<>(new MessageResponse("Deleted id: " + id), HttpStatus.OK);
    }
}