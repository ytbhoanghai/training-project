package com.example.demo.security;

import com.example.demo.entity.Staff;
import com.example.demo.exception.StaffNotFoundException;
import com.example.demo.repository.StaffRepository;
import com.example.demo.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

    private StaffRepository staffRepository;

    @Autowired
    public SecurityUtil(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    public UserDetails getCurrentPrincipal() {
        return (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    }

    public Staff getCurrentStaff() {
        UserDetails userDetails = getCurrentPrincipal();
        String username = userDetails.getUsername();

        return staffRepository.findByUsername(username)
                .orElseThrow(() -> {
                    String message = StaffNotFoundException.getMessageForExceptionNotFoundByUsername(username);
                    return new StaffNotFoundException(message);
                });
    }
}
