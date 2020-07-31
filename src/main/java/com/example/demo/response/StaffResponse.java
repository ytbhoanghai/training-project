package com.example.demo.response;

import com.example.demo.entity.Staff;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffResponse extends Staff {

    private Boolean allowUpdate;
    private Boolean allowDelete;

    public StaffResponse(Staff staff, Boolean allowUpdate, Boolean allowDelete) {
        super(
                staff.getId(),
                staff.getName(),
                staff.getUsername(),
                staff.getPassword(),
                staff.getEmail(),
                staff.getAddress(),
                staff.getCreatedAt(),
                staff.getCreatedBy(),
                staff.getStore(),
                staff.getType(),
                staff.getLevel(),
                staff.getIsManager(),
                staff.getIsDeleted(),
                staff.getRoles());

        this.allowUpdate = allowUpdate;
        this.allowDelete = allowDelete;
    }
}
