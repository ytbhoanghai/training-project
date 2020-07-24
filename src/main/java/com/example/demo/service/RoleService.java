package com.example.demo.service;

import com.example.demo.entity.Role;
import com.example.demo.form.RoleForm;
import com.example.demo.response.RoleResponse;
import com.example.demo.response.SimpleRoleResponse;

import java.util.List;

public interface RoleService {
    List<SimpleRoleResponse> findAll();

    RoleResponse findById(Integer id);

    Role save(RoleForm roleForm);

    Role update(Integer id, RoleForm roleForm);

    void delete(Integer id);

}
