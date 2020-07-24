package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.boot.autoconfigure.condition.ConditionalOnJava;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "resource")
@NamedEntityGraph(name = "graph.Resource.Permissions",
    attributeNodes = @NamedAttributeNode("permissions"))
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Integer id;

    private String name;

    @JsonIgnore
    private Date createdAt;

    @Size(max = 4)
    @OneToMany(mappedBy = "resource")
    private Set<Permission> permissions; // readonly
}
