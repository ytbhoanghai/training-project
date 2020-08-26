package com.example.demo.form;

import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffForm {

    @NotBlank
    @NotNull
    private String name;

    @Size(min = 4, max = 40)
    private String username;

    @Size(min = 4)
    private String password;

    @Email
    private String email;

    private String address;

    private Integer storeId;

    @Size(min = 0, max = 99)
    private Set<Integer> roleIds;

    public static Staff buildStaff(
            StaffForm staffForm, Staff createByStaff, Store ofStore, Set<Role> roles, Integer level, Staff.Type type) {

        return Staff.builder()
                .name(staffForm.getName())
                .username(staffForm.getUsername())
                .password(new BCryptPasswordEncoder().encode(staffForm.getPassword()))
                .email(staffForm.getEmail())
                .address(staffForm.getAddress())
                .store(ofStore)
                .createdAt(new Date())
                .createdBy(createByStaff)
                .type(type)
                .isManager(false)
                .isDeleted(false)
                .roles(roles)
                .level(level).build();
    }
}
