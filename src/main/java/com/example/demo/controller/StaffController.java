package com.example.demo.controller;

import com.example.demo.entity.Staff;
import com.example.demo.form.StaffForm;
import com.example.demo.repository.StaffRepository;
import com.example.demo.service.StaffServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ReportAsSingleViolation;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class StaffController {

    private StaffServiceImpl staffService;

    @Autowired
    public StaffController(StaffServiceImpl staffService) {
        this.staffService = staffService;
    }

    @GetMapping("/staffs")
    public ResponseEntity<List<Staff>> findAll() {
        List<Staff> staffs = staffService.findAll();
        return new ResponseEntity<>(staffs, HttpStatus.OK);
    }

    @GetMapping("/staffs/{staffId}")
    public ResponseEntity<Staff> findById(@PathVariable  Integer staffId) {
        Staff staff = staffService.findById(staffId);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("/staffs")
    public ResponseEntity<Staff> save(@Valid @RequestBody StaffForm staffForm) {
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PutMapping("/staffs/{staffId}")
    public ResponseEntity<Staff> update(@PathVariable Integer staffId, @Valid @RequestBody StaffForm staffForm) {
        return  new ResponseEntity<>(null, HttpStatus.OK);
    }

    @DeleteMapping("/staffs/{staffId}")
    public ResponseEntity<String> deleteById(@PathVariable Integer staffId) {
        return new ResponseEntity<>(null, HttpStatus.OK);
    }
}
