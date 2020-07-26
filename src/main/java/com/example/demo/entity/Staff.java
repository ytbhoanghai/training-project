package com.example.demo.entity;

import com.example.demo.form.StaffForm;
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
@Table(name = "staff")
@NamedEntityGraphs({
        @NamedEntityGraph(name = "graph.Staff.Roles", attributeNodes = {
                @NamedAttributeNode(value = "roles", subgraph = "subGraph.role.permissions")
        }, subgraphs = {
                @NamedSubgraph(name = "subGraph.role.permissions", attributeNodes = @NamedAttributeNode(value = "permissions"))
        })
})
public class Staff {

    public static final Type TYPE_DEFAULT = Type.OTHER;
    public static final Type ROOT_ADMIN = Type.ADMIN;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String username;

    @JsonIgnore
    private String password;

    private String email;

    private String address;

    private Date createdAt;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Staff createdBy;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_store")
    private Store store;

    @JsonIgnore
    private Type type;

//    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "staff_role",
            joinColumns = @JoinColumn(name = "id_staff"),
            inverseJoinColumns = @JoinColumn(name = "id_role"))
    private Set<Role> roles;

    public enum Type {
        ADMIN, OTHER
    }

    public static Staff updateData(Staff staff, StaffForm staffForm) {
        staff.setName(staffForm.getName());
        staff.setUsername(staffForm.getUsername());
        staff.setEmail(staffForm.getEmail());
        staff.setAddress(staffForm.getAddress());
        return staff;
    }

    public static Staff updateRole(Staff staff, Set<Role> roles) {
        staff.setRoles(roles);
        return staff;
    }

    public boolean isRootAdmin() {
        return this.getType().equals(ROOT_ADMIN);
    }
}
