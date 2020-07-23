package com.example.demo.form;

import lombok.Data;

import javax.persistence.criteria.CriteriaBuilder;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Set;

@Data
public class AddRoleToStaffForm {

    @NotNull
    @NotBlank
    private Integer staffId;

    @NotNull
    @NotBlank
    private Set<Integer> roleIds;

}
