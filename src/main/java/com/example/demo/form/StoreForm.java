package com.example.demo.form;

import com.example.demo.entity.Staff;
import com.example.demo.entity.Store;
import com.example.demo.entity.Store.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreForm {

    @NotBlank
    private String name;

    private String address;

    @Email
    private String email;

    @Pattern(regexp = "\\d{1,11}")
    private String phone;

    private Status status;

    public static Store buildStore(StoreForm storeForm, Staff createdBy) {
        return Store.builder()
                .name(storeForm.getName())
                .address(storeForm.getAddress())
                .email(storeForm.getEmail())
                .phone(storeForm.getPhone())
                .status(storeForm.getStatus())
                .createdBy(createdBy)
                .createdAt(new Date()).build();
    }

}
