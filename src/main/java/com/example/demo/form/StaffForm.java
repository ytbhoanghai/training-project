package com.example.demo.form;

import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;
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
            StaffForm staffForm, Staff createByStaff, Store ofStore, Set<Role> roles, Integer level) {

        return Staff.builder()
                .name(staffForm.getName())
                .username(staffForm.getUsername())
                .password(staffForm.getPassword())
                .email(staffForm.getEmail())
                .address(staffForm.getAddress())
                .store(ofStore)
                .createdAt(new Date())
                .createdBy(createByStaff)
                .type(Staff.TYPE_DEFAULT)
                .roles(roles)
                .level(level).build();
    }
}
