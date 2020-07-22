package com.example.demo.form;

import com.example.demo.entity.Permission;
import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleForm {

    @NotBlank
    @NotNull
    @Size(min = 4, max = 40)
    private String name;

    @NotNull
    @Size(min = 1)
    private Set<Integer> permissions;

    public static Role buildRole(RoleForm roleForm, Staff createByStaff, Set<Permission> permissions) {
        return Role.builder()
                .name(roleForm.getName())
                .permissions(permissions)
                .createdAt(new Date())
                .createdBy(createByStaff)
                .build();
    }
}
