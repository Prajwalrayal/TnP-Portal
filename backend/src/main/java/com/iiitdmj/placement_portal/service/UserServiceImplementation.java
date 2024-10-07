package com.iiitdmj.placement_portal.service;

import com.iiitdmj.placement_portal.constants.UserRole;
import com.iiitdmj.placement_portal.dto.UserResponse;
import com.iiitdmj.placement_portal.entity.User;
import com.iiitdmj.placement_portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    private UserRepository userRepository;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserResponse addUser(User user) {

        if ((user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.TPR)) {
            throw new IllegalArgumentException("Only admin can set ADMIN or TPR roles");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setLastLoginAt(LocalDateTime.now());
        user.setRole(UserRole.STUDENT);
        return new UserResponse(user);
    }

    @Override
    public UserResponse assignRole(String userEmail, UserRole role) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserRole = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(r -> r.equals("ROLE_ADMIN"))
                .findFirst()
                .orElse("ROLE_STUDENT");

        if ((role == UserRole.ADMIN || role == UserRole.TPR) && !currentUserRole.equals("ROLE_ADMIN")) {
            throw new IllegalArgumentException("Only admin can set ADMIN or TPR roles");
        }

        user.setRole(role);
        userRepository.save(user);
        return new UserResponse(user);



    }
}