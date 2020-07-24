package com.example.demo.response;

import com.example.demo.entity.Permission;
import lombok.AllArgsConstructor;
import lombok.Builder;

@AllArgsConstructor
@Builder
public class PermissionResponse {

    public Integer id;
    public String name;
    public String type;
    public String resourceName;

    public static PermissionResponse from(Permission permission) {
        return PermissionResponse.builder()
                .id(permission.getId())
                .name(permission.getName())
                .resourceName(permission.getResource().getName())
                .type(getTypeFromName(permission.getName())).build();
    }

    private static String getTypeFromName(String permissionName) {
        return permissionName.split("_")[1].toUpperCase();
    }
}
