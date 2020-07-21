package com.example.demo.entity;

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
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String name;

    private Date createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Staff createdBy;

    @ManyToMany
    @JoinTable(
            name = "role_permission",
            joinColumns = @JoinColumn(name = "id_role"),
            inverseJoinColumns = @JoinColumn(name = "id_permission"))
    private Set<Permission> permissions;

}
