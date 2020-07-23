package com.example.demo.security;

import com.example.demo.entity.Staff;
import com.example.demo.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service(value = "userDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

    private StaffService staffService;

    @Autowired
    public CustomUserDetailsService(StaffService staffService) {
        this.staffService = staffService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Staff staff = staffService.findByUsername(username);
        return buildUserDetailsFromStaff(staff);
    }


    private UserDetails buildUserDetailsFromStaff(Staff staff) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        staff.getRoles().forEach(role -> {
            role.getPermissions().forEach(permission -> {
                authorities.add(new SimpleGrantedAuthority(permission.getName()));
            });
        });

        return new User(staff.getUsername(), staff.getPassword(), true, true, true, true, authorities);
    }
}
