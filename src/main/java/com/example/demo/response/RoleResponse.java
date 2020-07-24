package com.example.demo.response;

import com.example.demo.entity.Permission;
import com.example.demo.entity.Role;
import lombok.*;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponse {

    private Integer id;

    private String name;

    private Integer createdBy;

    Set<PermissionResponse> permissions;

    public static RoleResponse from(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .createdBy(role.getCreatedBy().getId())
                .permissions(buildPermissionResponsesSet(role)).build();
    }

    private static Set<PermissionResponse> buildPermissionResponsesSet(Role role) {
        return role.getPermissions().stream()
                .map(PermissionResponse::from).collect(Collectors.toSet());
    }
}
