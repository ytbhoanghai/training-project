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
import com.example.demo.security.SecurityUtil;
import com.example.demo.service.RoleService;
import com.example.demo.service.StaffService;
import com.example.demo.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<Store> findAllStores() {
        return storeService.findAll();
    }

    @Override
    @GetMapping("stores/status")
    public Store.Status[] getStatusListStore() { return Store.Status.values(); }

    @Override
    @GetMapping("stores/{id}")
    public Store findStoreById(@PathVariable Integer id) { return storeService.findById(id); }

    @Override
    @PutMapping("stores/{id}")
    public Store updateStore(@PathVariable Integer id, @RequestBody StoreForm storeForm) { return storeService.update(id, storeForm); }

    @Override
    @PostMapping("stores")
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
    public Integer deleteStoreById(@PathVariable Integer id) { return storeService.deleteById(id); }



    // STAFF

    @Override
    @PostMapping("staffs")
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
    public List<Staff> findAllStaffs() {
        return staffService.findAllAndType(Staff.Type.ADMIN).stream()
                .filter(staff -> staff.getLevel() != 0)
                .collect(Collectors.toList());
    }

    @Override
    @GetMapping("staffs/{id}")
    public Staff findStaffById(@PathVariable Integer id) {
        return staffService.findByIdAndType(id, Staff.Type.ADMIN);
    }

    @Override
    @PutMapping("staffs/{id}")
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
    public Integer deleteStaffById(@PathVariable Integer id) {
        Staff staff = staffService.findByIdAndType(id, Staff.Type.ADMIN);
        return staffService.deleteById(staff.getId());
    }


    // ROLE

    @Override
    @GetMapping("roles/{id}")
    public RoleResponse findRoleById(@PathVariable Integer id) {
        Role role = roleService.findByIdAndStoreIsNull(id);
        return RoleResponse.from(role);
    }

    @Override
    @GetMapping("roles")
    public List<SimpleRoleResponse> findAllRoles() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        return roleService.findByStoreIsNull().stream()
                .map(role -> SimpleRoleResponse.from(
                        role,
                        roleService.isAllowedUpdate(role, currentStaff),
                        roleService.isAllowedDelete(role, currentStaff)
                ))
                .collect(Collectors.toList());
    }

    @Override
    @DeleteMapping("roles/{id}")
    public Integer deleteRoleById(@PathVariable Integer id) {
        Role role = roleService.findByIdAndStoreIsNull(id);
        roleService.delete(role.getId());
        return id;
    }

    @Override
    @PostMapping(value = "roles")
    public SimpleRoleResponse createRole(@Valid @RequestBody RoleForm roleForm) {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Role role = roleService.save(roleForm);

        return SimpleRoleResponse.from(
                roleService.save(roleForm),
                roleService.isAllowedUpdate(role, currentStaff),
                roleService.isAllowedDelete(role, currentStaff));
    }
}
