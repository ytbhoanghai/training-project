package com.example.demo.service;

import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.form.RoleForm;
import com.example.demo.response.RoleResponse;
import com.example.demo.response.SimpleRoleResponse;

import java.util.List;
import java.util.Set;

public interface RoleService {

    List<SimpleRoleResponse> findAll();

    List<Role> findAllByStore(Store store);

    Role findByIdAndStoreIsNotNull(Integer id);

    Role findByIdAndStoreIsNull(Integer id);

    RoleResponse findById(Integer id);

    Role save(RoleForm roleForm);

    Role update(Integer id, RoleForm roleForm);

    Integer delete(Integer id);

    Set<Role> findAllByIdIsIn(Set<Integer> roleIds);

    Boolean isAllowedUpdate(Role role, Staff currentStaff);

    Boolean isAllowedDelete(Role role, Staff currentStaff);

    List<Role> findByStoreIsNull();
}
