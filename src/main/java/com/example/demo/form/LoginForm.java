package com.example.demo.form;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginForm {

    @NotBlank
    @NotNull
    @Size(min = 4, max = 18)
    private String username;

    @NotBlank
    @NotNull
    @Size(min = 4)
    private String password;

}
