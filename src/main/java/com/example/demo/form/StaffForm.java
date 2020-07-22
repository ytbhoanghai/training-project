package com.example.demo.form;

import com.example.demo.entity.Staff;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffForm {

    @Autowired
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private static BCryptPasswordEncoder bCryptPasswordEncoder;

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

    public static Staff buildStaff(StaffForm staffForm) {
        String passwordHash = bCryptPasswordEncoder.encode(staffForm.getPassword());

        return Staff.builder()
                .name(staffForm.getName())
                .username(staffForm.getUsername())
                .password(passwordHash)
                .email(staffForm.getEmail())
                .address(staffForm.getAddress())
                .build();
    }
}
