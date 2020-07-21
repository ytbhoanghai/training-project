package com.example.demo.form;

import com.example.demo.entity.Staff;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

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

    private String password;

    @Email
    private String email;

    private String address;

    public static Staff buildStaff(StaffForm staffForm) {
       return Staff.builder()
               .name(staffForm.getName())
               .username(staffForm.getUsername())
               .password(staffForm.getPassword())
               .email(staffForm.getEmail())
               .address(staffForm.getAddress())
               .build();
    }
}
