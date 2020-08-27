package com.example.demo.controller.ui;

import com.example.demo.entity.Role;
import com.example.demo.form.RoleForm;
import com.example.demo.response.RoleResponse;
import com.example.demo.response.SimpleRoleResponse;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.Valid;
import java.util.List;

@Transactional
public interface IRole {

    RoleResponse findRoleById(Integer id);

    List<SimpleRoleResponse> findAllRoles();

    Role updateRoleById(Integer id, @Valid RoleForm roleForm);

    Integer deleteRoleById(Integer id);

    SimpleRoleResponse createRole(@Valid RoleForm roleForm);

}
