package com.example.demo.entity;

import com.example.demo.form.RoleForm;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "role")
@NamedEntityGraph(name = "graph.Role.Staff-Permissions",
    attributeNodes = { @NamedAttributeNode("createdBy"), @NamedAttributeNode("permissions") })
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private Date createdAt;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Staff createdBy;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "role_permission",
            joinColumns = @JoinColumn(name = "id_role"),
            inverseJoinColumns = @JoinColumn(name = "id_permission"))
    private Set<Permission> permissions;

    public static Role updateData(RoleForm roleForm, Staff createByStaff, Set<Permission> permissions) {
        return Role.builder()
                .name(roleForm.getName())
                .createdBy(createByStaff)
                .permissions(permissions)
                .build();
    }
}
