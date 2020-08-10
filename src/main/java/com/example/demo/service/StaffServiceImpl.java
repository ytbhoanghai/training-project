package com.example.demo.service;

import com.example.demo.entity.Permission;
import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.exception.RoleNotFoundException;
import com.example.demo.exception.StaffNotFoundException;
import com.example.demo.exception.WrongOldPasswordException;
import com.example.demo.form.StaffForm;
import com.example.demo.form.UpdatePasswordForm;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.StaffRepository;
import com.example.demo.repository.StoreRepository;
import com.example.demo.response.StaffResponse;
import com.example.demo.security.SecurityUtil;
import com.example.demo.security.constants.StaffPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
    public List<Staff> findAllByStoreAndIsManager(Store store, Boolean isManager) {
        return staffRepository.findAllByStoreAndIsManager(store, isManager);
    }

    @Override
    public List<Staff> findAllByIdIsIn(Set<Integer> ids) {
        return staffRepository.findAllByIdIsIn(ids);
    }

    @Override
    public List<StaffResponse> findAll() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        return staffRepository.findAll().stream()
                .map(staff -> convertStaffToStaffResponse(staff, currentStaff))
                .collect(Collectors.toList());
    }

    @Override
    public Staff findById(Integer id) {
        return staffRepository.findById(id)
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

        Staff newStaff = StaffForm.buildStaff(staffForm, currentStaff, store, roles, currentStaff.getLevel() + 1);
        newStaff.setPassword(new BCryptPasswordEncoder().encode(staffForm.getPassword()));

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
        Store store = null;
        if (staffForm.getStoreId() != null) {
            store = storeRepository.findById(staffForm.getStoreId())
                    .orElse(null);
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

        return staffRepository.save(staff.updateData(staffForm, store, roles));
    }

    @Override
    public boolean updatePassword(UpdatePasswordForm updatePasswordForm) {
        Staff currentStaff = securityUtil.getCurrentStaff();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        Throw Error if password doesn't match
        if (!passwordEncoder.matches(updatePasswordForm.getOldPass(), currentStaff.getPassword())) {
            throw new WrongOldPasswordException();
        }
//        Set new hashed password to user
        currentStaff.setPassword(passwordEncoder.encode(updatePasswordForm.getNewPass()));
        staffRepository.save(currentStaff);
        return true;
    }

    @Override
    public List<Staff> findAllByStoreIsNull() {
        return staffRepository.findAllByStoreIsNull();
    }

    @Override
    public String deleteById(Integer id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new StaffNotFoundException(id));

        if (!isAllowedDelete(staff, securityUtil.getCurrentStaff())) {
            throw new AccessDeniedException("Access Denied !!!");
        }

        staff.setIsDeleted(true);
        staffRepository.save(staff);

        return String.valueOf(id);
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

    private Boolean isAllowedUpdate(Staff staff, Staff currentStaff) {
        if (currentStaff.hasPermission(StaffPermission.UPDATE)) {
            return currentStaff.isAdmin()
                    || currentStaff.getLevel() < staff.getLevel()
                    || staff.equals(currentStaff);
        }
        return false;
    }

    private Boolean isAllowedUpdateRole(Staff staff, Staff currentStaff) {
        if (currentStaff.hasPermission(StaffPermission.UPDATE)) {
            return currentStaff.isAdmin()
                    || currentStaff.getLevel() < staff.getLevel();
        }
        return false;
    }

    private Boolean isAllowedDelete(Staff staff, Staff currentStaff) {
        if (currentStaff.hasPermission(StaffPermission.DELETE)) {
            if (staff.getLevel() == 0) {
                return false;
            }
            return currentStaff.isAdmin() || currentStaff.getLevel() < staff.getLevel();
        }
        return false;
    }
}
