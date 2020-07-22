package com.example.demo.form;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePasswordForm {

    @NotBlank
    @NotNull
    @Size(min = 4, max = 40)
    private String oldPass;

    @NotBlank
    @NotNull
    @Size(min = 4, max = 40)
    private String newPass;
}
