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

    public static SimpleRoleResponse from(Role role) {
        return SimpleRoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .createdAt(role.getCreatedAt())
                .build();
    }
}
