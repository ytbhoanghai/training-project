package com.example.demo.controller;

import com.example.demo.entity.Staff;
import com.example.demo.form.StaffForm;
import com.example.demo.form.UpdatePasswordForm;
import com.example.demo.response.MessageResponse;
import com.example.demo.response.StaffResponse;
import com.example.demo.security.constants.StaffPermission;
import com.example.demo.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staffs")
@Validated
public class StaffController {

    private StaffService staffService;

    @Autowired
    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public ResponseEntity<List<StaffResponse>> findAll(@RequestParam(required = false, defaultValue = "All") String option) {
        List<StaffResponse> staffs = null;
        switch (option) {
            case "All":
                staffs = staffService.findAllAndConventToResponse();
                break;
            case "NotInStore":
                staffs = staffService.findAllByStoreIsNull().stream()
                        .map(staff -> new StaffResponse(staff, null, null))
                        .collect(Collectors.toList());
                break;
        }
        return new ResponseEntity<>(staffs, HttpStatus.OK);
    }

    @GetMapping("{staffId}")
    @PreAuthorize("hasAuthority(\"" + StaffPermission.READ + "\")")
    public ResponseEntity<Staff> findById(@PathVariable  Integer staffId) {
        Staff staff = staffService.findById(staffId);
        return new ResponseEntity<>(staff, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAuthority(\"" + StaffPermission.CREATE + "\")")
    public ResponseEntity<Staff> save(@Valid @RequestBody StaffForm staffForm) {
        Staff newStaff = staffService.save(staffForm);
        return new ResponseEntity<>(newStaff, HttpStatus.OK);
    }

    @PutMapping("{staffId}")
    @PreAuthorize("hasAuthority(\"" + StaffPermission.UPDATE + "\")")
    public ResponseEntity<MessageResponse> update(@PathVariable Integer staffId, @Valid @RequestBody StaffForm staffForm) {
        staffService.update(staffId, staffForm);
        return new ResponseEntity<>(new MessageResponse("Update account successfully"), HttpStatus.OK);
    }

    @DeleteMapping("{staffId}")
    @PreAuthorize("hasAuthority(\"" + StaffPermission.DELETE + "\")")
    public ResponseEntity<?> deleteById(@PathVariable Integer staffId) {
        Integer deletedId = staffService.deleteById(staffId);
        return new ResponseEntity<>(new MessageResponse("Deleted successfully Staff ID: " + deletedId), HttpStatus.OK);
    }
}
