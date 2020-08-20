package com.example.demo.response;

import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountResponse implements Serializable {

    private Integer id;
    private String name;
    private String username;
    private String email;
    private String address;
    private Integer createdBy;
    private Staff.Type type;
    private Date createdAt;
    private Integer idStore;
    private Boolean isManager;
    private List<String> roles;

    public static AccountResponse build(Staff staff) {
        List<String> roles = staff.getRoles().stream()
                .map(role -> "ROLE_" + role.getName())
                .collect(Collectors.toList());

        return AccountResponse.builder()
                .id(staff.getId())
                .name(staff.getName())
                .username(staff.getUsername())
                .email(staff.getEmail())
                .address(staff.getAddress())
                .createdBy(staff.getCreatedBy() != null ? staff.getCreatedBy().getId() : null)
                .type(staff.getType())
                .createdAt(staff.getCreatedAt())
                .idStore(staff.getStore() != null ? staff.getStore().getId() : null)
                .isManager(staff.getIsManager())
                .roles(roles).build();
    }

}
