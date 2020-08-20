package com.example.demo.entity;

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
    attributeNodes = { @NamedAttributeNode("createdBy"), @NamedAttributeNode(value = "permissions", subgraph = "subGraph.permissions.resource") },
    subgraphs = @NamedSubgraph(name = "subGraph.permissions.resource", attributeNodes = @NamedAttributeNode("resource")))
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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    private Boolean grantable;

    private Integer level;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "role_permission",
            joinColumns = @JoinColumn(name = "id_role"),
            inverseJoinColumns = @JoinColumn(name = "id_permission"))
    private Set<Permission> permissions;


    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "staff_role",
            joinColumns = @JoinColumn(name = "id_role"),
            inverseJoinColumns = @JoinColumn(name = "id_staff"))
    private Set<Staff> staffs;


    public Role updateData(String name, Set<Permission> permissions) {
        this.name = name;
        this.permissions = permissions;
        return this;
    }
}
