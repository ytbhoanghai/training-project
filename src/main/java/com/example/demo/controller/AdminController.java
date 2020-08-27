package com.example.demo.controller;

import com.example.demo.controller.ui.IRole;
import com.example.demo.controller.ui.IStaff;
import com.example.demo.controller.ui.IStoreAdmin;
import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.form.RoleForm;
import com.example.demo.form.StaffForm;
import com.example.demo.form.StoreForm;
import com.example.demo.response.RoleResponse;
import com.example.demo.response.SimpleRoleResponse;
import com.example.demo.response.StaffResponse;
import com.example.demo.security.SecurityUtil;
import com.example.demo.security.constants.CategoryPermission;
import com.example.demo.security.constants.RolePermission;
import com.example.demo.security.constants.StaffPermission;
import com.example.demo.security.constants.StorePermission;
import com.example.demo.service.RoleService;
import com.example.demo.service.StaffService;
import com.example.demo.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@Validated
@Transactional
public class AdminController implements IStoreAdmin, IStaff, IRole {

    private StoreService storeService;
    private StaffService staffService;
    private SecurityUtil securityUtil;

    private RoleService roleService;

    @Autowired
    public AdminController(
            StoreService storeService,
            StaffService staffService,
            SecurityUtil securityUtil,
            RoleService roleService) {

        this.storeService = storeService;
        this.staffService = staffService;
        this.securityUtil = securityUtil;

        this.roleService = roleService;
    }


    // STORE

    @Override
    @GetMapping("stores")
    @PreAuthorize("hasAuthority(\"" + StorePermission.READ + "\")")
    public List<Store> findAllStores() {
        return storeService.findAll().stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    @GetMapping("stores/status")
    @PreAuthorize("hasAuthority(\"" + StorePermission.READ + "\")")
    public Store.Status[] getStatusListStore() { return Store.Status.values(); }

    @Override
    @GetMapping("stores/{id}")
    @PreAuthorize("hasAuthority(\"" + StorePermission.READ + "\")")
    public Store findStoreById(@PathVariable Integer id) { return storeService.findById(id); }

    @Override
    @PutMapping("stores/{id}")
    @PreAuthorize("hasAuthority(\"" + StorePermission.UPDATE + "\")")
    public Store updateStore(@PathVariable Integer id, @RequestBody StoreForm storeForm) { return storeService.update(id, storeForm); }

    @Override
    @PostMapping("stores")
    @PreAuthorize("hasAuthority(\"" + StorePermission.CREATE + "\")")
    public Store createStore(@Valid @RequestBody StoreForm storeForm) {
        Store store = storeService.save(storeForm);
        staffService.createAccountManagerForStore(
                securityUtil.getCurrentStaff(),
                store,
                storeForm);

        return store;
    }

    @Override
    @DeleteMapping("stores/{id}")
    @PreAuthorize("hasAuthority(\"" + StorePermission.DELETE + "\")")
    public Integer deleteStoreById(@PathVariable Integer id) { return storeService.deleteById(id); }



    // STAFF

    @Override
    @PostMapping("staffs")
    @PreAuthorize("hasAuthority(\"" + StaffPermission.CREATE + "\")")
    public Staff createStaff(@Valid @RequestBody StaffForm staffForm) {
        Staff currentStaff = securityUtil.getCurrentStaff();

        Set<Role> roles = new HashSet<>();
        if (!staffForm.getRoleIds().isEmpty()) {
            roles = roleService.findAllByIdIsIn(staffForm.getRoleIds());
        }

        Staff account = StaffForm.buildStaff(
                staffForm,
                currentStaff,
                null,
                roles,
                currentStaff.getLevel() + 1,
                Staff.Type.ADMIN);

        return staffService.save(account);
    }

    @Override
    @GetMapping("staffs")
    @PreAuthorize("hasAuthority(\"" + StaffPermission.READ + "\")")
    public List<StaffResponse> findAllStaffs() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        return staffService.findAllAndType(Staff.Type.ADMIN).stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .filter(staff -> staff.getLevel() != 0)
                .map(staff -> new StaffResponse(
                        staff,
                        staffService.isAllowedUpdate(staff, currentStaff),
                        staffService.isAllowedDelete(staff, currentStaff))
                )
                .collect(Collectors.toList());
    }

    @Override
    @GetMapping("staffs/{id}")
    @PreAuthorize("hasAuthority(\"" + StaffPermission.READ + "\")")
    public Staff findStaffById(@PathVariable Integer id) {
        return staffService.findByIdAndType(id, Staff.Type.ADMIN);
    }

    @Override
    @PutMapping("staffs/{id}")
    @PreAuthorize("hasAuthority(\"" + StaffPermission.UPDATE + "\")")
    public Staff updateStaff(@PathVariable Integer id, @Valid @RequestBody StaffForm staffForm) {
        Staff staff = staffService.findByIdAndType(id, Staff.Type.ADMIN);

        staff.setName(staffForm.getName());
        staff.setEmail(staffForm.getEmail());
        staff.setAddress(staffForm.getAddress());
        Set<Role> roles = roleService.findAllByIdIsIn(staffForm.getRoleIds());
        staff.setRoles(roles);

        return staffService.save(staff);
    }

    @Override
    @DeleteMapping(value = "staffs/{id}")
    @PreAuthorize("hasAuthority(\"" + StaffPermission.DELETE + "\")")
    public Integer deleteStaffById(@PathVariable Integer id) {
        Staff staff = staffService.findByIdAndType(id, Staff.Type.ADMIN);
        return staffService.deleteById(staff.getId());
    }


    // ROLE

    @Override
    @GetMapping("roles/{id}")
    @PreAuthorize("hasAuthority(\"" + RolePermission.READ + "\")")
    public RoleResponse findRoleById(@PathVariable Integer id) {
        Role role = roleService.findByIdAndStoreIsNull(id);
        return RoleResponse.from(role);
    }

    @Override
    @GetMapping("roles")
    @PreAuthorize("hasAuthority(\"" + RolePermission.READ + "\")")
    public List<SimpleRoleResponse> findAllRoles() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        return roleService.findByStoreIsNull().stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .filter(Role::getGrantable)
                .map(role -> SimpleRoleResponse.from(
                        role,
                        roleService.isAllowedUpdate(role, currentStaff),
                        roleService.isAllowedDelete(role, currentStaff)
                ))
                .collect(Collectors.toList());
    }

    @Override
    @PutMapping("roles/{id}")
    @PreAuthorize("hasAuthority(\"" + RolePermission.UPDATE + "\")")
    public Role updateRoleById(@PathVariable Integer id, @Valid @RequestBody RoleForm roleForm) {
        return roleService.update(id, roleForm);
    }

    @Override
    @DeleteMapping("roles/{id}")
    @PreAuthorize("hasAuthority(\"" + RolePermission.DELETE + "\")")
    public Integer deleteRoleById(@PathVariable Integer id) {
        Role role = roleService.findByIdAndStoreIsNull(id);
        roleService.delete(role.getId());
        return id;
    }

    @Override
    @PostMapping(value = "roles")
    @PreAuthorize("hasAuthority(\"" + RolePermission.CREATE + "\")")
    public SimpleRoleResponse createRole(@Valid @RequestBody RoleForm roleForm) {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Role role = roleService.save(roleForm);

        return SimpleRoleResponse.from(
                role,
                roleService.isAllowedUpdate(role, currentStaff),
                roleService.isAllowedDelete(role, currentStaff));
    }
}
