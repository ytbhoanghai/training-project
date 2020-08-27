package com.example.demo.response;

import com.example.demo.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimpleRoleResponse {

    private Integer id;

    private String name;

    private Date createdAt;

    private String createdBy;

    private Boolean allowUpdate;

    private Boolean allowDelete;

    public static SimpleRoleResponse from(Role role, Boolean allowUpdate, Boolean allowDelete) {
        return SimpleRoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .createdAt(role.getCreatedAt())
                .createdBy(role.getCreatedBy().getUsername())
                .allowUpdate(allowUpdate)
                .allowDelete(allowDelete).build();
    }
}
