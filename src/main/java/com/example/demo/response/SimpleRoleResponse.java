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

    private Boolean allowUpdate;

    private Boolean allowDelete;

    public static SimpleRoleResponse from(Role role, Boolean allowUpdate, Boolean allowDelete) {
        return SimpleRoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .createdAt(role.getCreatedAt())
                .allowUpdate(allowUpdate)
                .allowDelete(allowDelete).build();
    }
}
