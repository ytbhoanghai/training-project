package com.example.demo.service;

import com.example.demo.entity.Permission;
import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import com.example.demo.exception.PermissionInvalidException;
import com.example.demo.exception.RoleNotCreateByCurrentStaffException;
import com.example.demo.exception.RoleNotFoundException;
import com.example.demo.form.RoleForm;
import com.example.demo.repository.RoleRepository;
import com.example.demo.response.RoleResponse;
import com.example.demo.response.SimpleRoleResponse;
import com.example.demo.security.SecurityUtil;
import com.example.demo.security.constants.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import javax.persistence.Id;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service(value = "roleService")
public class RoleServiceImpl implements RoleService {

    private RoleRepository roleRepository;
    private StaffService staffService;
    private PermissionService permissionService;
    private SecurityUtil securityUtil;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository,
                           SecurityUtil securityUtil,
                           StaffService staffService,
                           PermissionService permissionService) {

        this.roleRepository = roleRepository;
        this.securityUtil = securityUtil;
        this.staffService = staffService;
        this.permissionService = permissionService;
    }

    @Override
    public List<SimpleRoleResponse> findAll() {
        Staff staff = securityUtil.getCurrentStaff();
        List<Role> roleList = roleRepository.findAll(true);
        return roleList.stream()
                .map(role -> SimpleRoleResponse.from(
                        role,
                        isAllowedUpdate(role, staff),
                        isAllowedDelete(role, staff)))
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
        Staff currentStaff = securityUtil.getCurrentStaff();

        handlePermissionsIsValid(currentStaff, roleForm.getPermissions()); // throw exception if not valid
        Set<Permission> permissions = permissionService.findAllByIdIsIn(roleForm.getPermissions());

        return roleRepository.save(RoleForm.buildRole(roleForm.getName(), currentStaff, permissions));
    }

    @Override
    public Role update(Integer id, RoleForm roleForm) {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RoleNotFoundException(id));

        if (!isAllowedUpdate(role, currentStaff)) {
            throw new AccessDeniedException("Access Denied !!!");
        }

        handlePermissionsIsValid(currentStaff, roleForm.getPermissions()); // throw exception if not valid
        Set<Permission> permissions = permissionService.findAllByIdIsIn(roleForm.getPermissions());
        return roleRepository.save(role.updateData(
                roleForm.getName(),
                permissions));
    }

    @Override
    public void delete(Integer id) {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RoleNotFoundException(id));

        if (!isAllowedDelete(role, currentStaff)) {
            throw new AccessDeniedException("Access Denied !!!");
        }

        roleRepository.deleteById(role.getId());
    }

    private Boolean isAllowedUpdate(Role role, Staff currentStaff) {
        if (currentStaff.hasPermission(RolePermission.UPDATE)) {
            return currentStaff.getLevel() < role.getLevel()
                    || role.getCreatedBy().equals(currentStaff);
        }
        return false;
    }

    private Boolean isAllowedDelete(Role role, Staff currentStaff) {
        if (!currentStaff.hasPermission(RolePermission.DELETE) || !role.getGrantable()) {
            return false;
        }
        return currentStaff.getLevel() < role.getLevel()
                || role.getCreatedBy().equals(currentStaff);
    }

    private void handlePermissionsIsValid(Staff currentStaff, Set<Integer> permissions) {
        String message = "Permissions";
        List<Integer> currentPermissions = staffService.getPermissionIdsOfCurrentStaff(currentStaff);
        List<Integer> blacklist = permissionService.findByGrantable(false).stream()
                .map(Permission::getId)
                .collect(Collectors.toList());

        int count = 0;
        for (Integer id : permissions) {
            if (currentPermissions.contains(id) && !blacklist.contains(id)) {
                count += 1;
            } else {
                message += (" " + id);
            }
        }
        if (count != permissions.size()) {
            message += " is not allowed to use";
            throw new PermissionInvalidException(message);
        }
    }
}
