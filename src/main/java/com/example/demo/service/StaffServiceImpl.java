package com.example.demo.service;

import com.example.demo.entity.Permission;
import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.exception.RoleNotFoundException;
import com.example.demo.exception.StaffNotFoundException;
import com.example.demo.exception.WrongOldPasswordException;
import com.example.demo.form.StaffForm;
import com.example.demo.form.StoreForm;
import com.example.demo.form.UpdatePasswordForm;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.StaffRepository;
import com.example.demo.repository.StoreRepository;
import com.example.demo.response.StaffResponse;
import com.example.demo.security.SecurityUtil;
import com.example.demo.security.constants.StaffPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service(value = "staffService")
public class StaffServiceImpl implements StaffService {

    private StaffRepository staffRepository;
    private StoreRepository storeRepository;
    private RoleRepository roleRepository;
    private SecurityUtil securityUtil;

    @Autowired
    public StaffServiceImpl(
            StaffRepository staffRepository,
            SecurityUtil securityUtil,
            RoleRepository roleRepository,
            StoreRepository storeRepository) {
        this.staffRepository = staffRepository;
        this.securityUtil = securityUtil;
        this.roleRepository = roleRepository;
        this.storeRepository = storeRepository;
    }

    @Override
    public Staff findByUsername(String username) {
        return staffRepository.findByUsername(username)
                .orElseThrow(() -> {
                    String message = StaffNotFoundException.getMessageForExceptionNotFoundByUsername(username);
                    return new StaffNotFoundException(message);
                });
    }

    @Override
    public List<Staff> findAllByStore(Store store) {
        return staffRepository.findAllByStore(store);
    }

    @Override
    public List<Staff> findAllAndType(Staff.Type type) {
        return staffRepository.findAllAndType(type);
    }

    @Override
    public List<Staff> findAllByStoreAndIsManager(Store store, Boolean isManager) {
        return staffRepository.findAllByStoreAndIsManager(store, isManager);
    }

    @Override
    public List<Staff> findAllByIdIsIn(Set<Integer> ids) {
        return staffRepository.findAllByIdIsIn(ids);
    }

    @Override
    public List<StaffResponse> findAllAndConventToResponse() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        return staffRepository.findAll().stream()
                .filter(staff -> staff.getLevel() > currentStaff.getLevel())
                .filter(staff -> {
                    if (currentStaff.isAdmin() || currentStaff.getStore() == null) return true;
                    return currentStaff.getStore().equals(staff.getStore());
                })
                .map(staff -> convertStaffToStaffResponse(staff, currentStaff))
                .collect(Collectors.toList());
    }

    @Override
    public Staff findByIdAndType(Integer id, Staff.Type type) {
        return staffRepository.findByIdAndType(id, type)
                .orElseThrow(() -> new StaffNotFoundException(id));
    }

    @Override
    public Staff save(StaffForm staffForm) {
        Staff currentStaff = securityUtil.getCurrentStaff();

        Store store = null;
        if (staffForm.getStoreId() != null) {
            store = storeRepository
                    .findById(staffForm.getStoreId())
                    .orElseThrow(null);
        }

        Set<Role> roles = new HashSet<>();
        if (!staffForm.getRoleIds().isEmpty()) {
            roles = roleRepository.findAllByIdIsIn(staffForm.getRoleIds());
        }

        Staff newStaff = StaffForm.buildStaff(staffForm, currentStaff, store, roles, currentStaff.getLevel() + 1, Staff.Type.OTHER);

        return staffRepository.save(newStaff);
    }

    @Override
    public Staff save(Staff staff) {
        return staffRepository.save(staff);
    }

    @Override
    public List<Staff> saveAll(List<Staff> staff) {
        return staffRepository.saveAll(staff);
    }

    @Override
    public Staff update(Integer id, StaffForm staffForm) {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Staff staff = findById(id);

        // current user not allowed update staff info (level less than)
        if (!isAllowedUpdate(staff, currentStaff)) {
            throw new AccessDeniedException("Access Denied !!!");
        }

        Set<Role> roles = new HashSet<>();
        if (staff.isAdmin()) {
            Role roleAdmin = roleRepository.findById(1)
                    .orElseThrow(() -> new RoleNotFoundException(1));
            roles.add(roleAdmin);
        }
        if (!staffForm.getRoleIds().isEmpty()) {
            if (isAllowedUpdateRole(staff, currentStaff)) {
                roles.addAll(roleRepository.findAllByIdIsIn(staffForm.getRoleIds()));
            } else {
                throw new AccessDeniedException("You not have permission to do update roles");
            }
        } else {
            roles.addAll(staff.getRoles());
        }

        return staffRepository.save(staff.updateData(staffForm, roles));
    }

    @Override
    public Staff findById(Integer id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new StaffNotFoundException(id));
    }

    @Override
    public List<Staff> findAllByStoreIsNull() {
        return staffRepository.findAllByStoreIsNull();
    }

    @Override
    public Map<String, List<String>> checkPermissionsOfCurrentStaff(Map<String, List<String>> permissions) {
        HashMap<String, List<String>> responses = new HashMap<>();

        Staff staff = securityUtil.getCurrentStaff();
        permissions.forEach((resourceName, permissionValues) -> {
            permissionValues.forEach(permissionValue -> {
                String _resourceName = resourceName.trim().toLowerCase();
                String _permissionValue = permissionValue.trim().toLowerCase();

                if (isExistsPermission(staff, _resourceName, _permissionValue)) {
                    if (!responses.containsKey(_resourceName)) {
                        responses.put(_resourceName, new ArrayList<>());
                    }
                    responses.get(_resourceName).add(_permissionValue);
                }
            });
        });

        return responses;
    }

    @Override
    public Integer deleteById(Integer id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new StaffNotFoundException(id));

        Staff currentStaff = securityUtil.getCurrentStaff();
        if (!isAllowedDelete(staff, currentStaff)) {
            throw new AccessDeniedException("Access Denied !!!");
        }

        staff.setIsDeleted(true);
        staffRepository.save(staff);

        return id;
    }

    @Override
    public List<Integer> getPermissionIdsOfCurrentStaff(Staff currentStaff) {
        List<Integer> result = new ArrayList<>();
        currentStaff.getRoles().forEach(role -> {
            List<Integer> permissionIds = role.getPermissions().stream()
                    .map(Permission::getId)
                    .collect(Collectors.toList());
            result.addAll(permissionIds);
        });
        return result;
    }

    private StaffResponse convertStaffToStaffResponse(Staff staff, Staff currentStaff) {
        return new StaffResponse(staff,
                isAllowedUpdate(staff, currentStaff),
                isAllowedDelete(staff, currentStaff));
    }

    private Boolean isExistsPermission(Staff staff, String resourceName, String permissionValue) {

        resourceName = resourceName.trim().toLowerCase();
        permissionValue = permissionValue.trim().toLowerCase();

        for (Role role : staff.getRoles()) {
            for (Permission permission : role.getPermissions()) {
                String _resourceName = permission.getResource().getName();
                String permissionName = permission.getName();
                String _permissionValue = permissionName.substring(permissionName.lastIndexOf("_") + 1);

                if (resourceName.equals(_resourceName) && permissionValue.equals(_permissionValue)) {
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public Boolean isAllowedUpdate(Staff staff, Staff currentStaff) {
        return currentStaff.getType() == staff.getType() && currentStaff.hasPermission(StaffPermission.UPDATE);
    }

    @Override
    public Boolean isAllowedUpdateRole(Staff staff, Staff currentStaff) {
        return currentStaff.getType() == staff.getType() && currentStaff.hasPermission(StaffPermission.UPDATE);
    }

    @Override
    public Boolean isAllowedDelete(Staff staff, Staff currentStaff) {
        return currentStaff.getType() == staff.getType() && currentStaff.hasPermission(StaffPermission.DELETE);
    }

    @Override
    public Staff createAccountManagerForStore(Staff createdBy, Store store, StoreForm storeForm) {
        // get role store_manager
        Role role = roleRepository.findById(2)
                .orElseThrow(() -> new RoleNotFoundException(1));
        Staff staff = Staff.builder()
                .username(storeForm.getEmail())
                .password(new BCryptPasswordEncoder().encode("1234"))
                .isManager(true)
                .roles(Collections.singleton(role))
                .store(store)
                .createdBy(createdBy)
                .type(Staff.Type.OTHER)
                .level(0)
                .name("Store Manager")
                .email(storeForm.getEmail())
                .address(storeForm.getAddress())
                .isDeleted(false)
                .createdAt(new Date()).build();

        return save(staff);
    }

}
