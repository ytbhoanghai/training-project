package com.example.demo.service;

import com.example.demo.entity.Permission;
import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import com.example.demo.exception.RoleNotFoundException;
import com.example.demo.form.RoleForm;
import com.example.demo.repository.RoleRepository;
import com.example.demo.response.RoleResponse;
import com.example.demo.response.SimpleRoleResponse;
import com.example.demo.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service(value = "roleService")
public class RoleServiceImpl implements RoleService {

    private RoleRepository roleRepository;
    private StaffServiceImpl staffService;
    private PermissionServiceImpl permissionService;
    private SecurityUtil securityUtil;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository,
                           SecurityUtil securityUtil,
                           StaffServiceImpl staffService,
                           PermissionServiceImpl permissionService ) {
        this.roleRepository = roleRepository;
        this.securityUtil = securityUtil;
        this.staffService = staffService;
        this.permissionService = permissionService;
    }

    @Override
    public List<SimpleRoleResponse> findAll() {
        List<Role> roleList = roleRepository.findAll();
        return roleList.stream()
                .map(SimpleRoleResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public RoleResponse findById(Integer id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RoleNotFoundException(id));
        return RoleResponse.from(role);
    }

    @Override
    public Role save(RoleForm roleForm) {
        Staff createByStaff = staffService.findStaffByUsername(
                securityUtil.getCurrentPrincipal().getUsername());
        Set<Permission> permissions = permissionService.findAllByIdIsIn(roleForm.getPermissions());
        Role role = roleRepository.save(RoleForm.buildRole(roleForm, createByStaff, permissions));
        return role;
    }

    @Override
    public Role update(Integer id, RoleForm roleForm) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RoleNotFoundException(id));
        Staff createByStaff = staffService.findStaffByUsername(
                securityUtil.getCurrentPrincipal().getUsername());
        Set<Permission> permissions = permissionService.findAllByIdIsIn(roleForm.getPermissions());
        return roleRepository.save(Role.updateData(role, roleForm, createByStaff, permissions));
    }

    @Override
    public String delete(Integer id) {
        roleRepository.deleteById(id);
        return String.valueOf(id);
    }
}
