package com.example.demo.controller;

import com.example.demo.entity.Role;
import com.example.demo.form.RoleForm;
import com.example.demo.response.MessageResponse;
import com.example.demo.response.RoleResponse;
import com.example.demo.response.SimpleRoleResponse;
import com.example.demo.security.constants.RolePermission;
import com.example.demo.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private RoleService roleService;

    @Autowired
    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public ResponseEntity<List<SimpleRoleResponse>> findAll() {
        List<SimpleRoleResponse> simpleRoleList = roleService.findAll();
        return new ResponseEntity<>(simpleRoleList, HttpStatus.OK);
    }

    @GetMapping("{roleId}")
    @PreAuthorize("hasAuthority(\"" + RolePermission.READ + "\")")
    public ResponseEntity<RoleResponse> findById(@PathVariable Integer roleId) {
        RoleResponse roleResponse = roleService.findById(roleId);
        return new ResponseEntity<>(roleResponse, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAuthority(\"" + RolePermission.CREATE + "\")")
    public ResponseEntity<Role> save(@Valid @RequestBody RoleForm roleForm) {
        Role role = roleService.save(roleForm);
        return new ResponseEntity<>(role, HttpStatus.OK);
    }

    @PutMapping("{roleId}")
    @PreAuthorize("hasAuthority(\"" + RolePermission.UPDATE + "\")")
    public ResponseEntity<Role> update(@PathVariable Integer roleId, @Valid @RequestBody RoleForm roleForm) {
        Role role = roleService.update(roleId, roleForm);
        return new ResponseEntity<>(role, HttpStatus.OK);
    }

    @DeleteMapping("{roleId}")
    @PreAuthorize("hasAuthority(\"" + RolePermission.DELETE + "\")")
    public ResponseEntity<MessageResponse> delete(@PathVariable Integer roleId) {
        roleService.delete(roleId);
        return new ResponseEntity<>(new MessageResponse("Deleted Role Id: " + roleId), HttpStatus.OK);
    }
}
