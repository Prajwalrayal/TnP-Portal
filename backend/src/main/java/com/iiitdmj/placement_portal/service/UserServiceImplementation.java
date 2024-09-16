package com.iiitdmj.placement_portal.service;

import com.iiitdmj.placement_portal.dto.UserResponse;
import com.iiitdmj.placement_portal.entity.StudentRole;
import com.iiitdmj.placement_portal.entity.User;
import com.iiitdmj.placement_portal.entity.UserRole;
import com.iiitdmj.placement_portal.repository.StudentRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
@Service
public class UserServiceImplementation implements UserService {
    @Autowired
    private StudentRoleRepository studentRoleRepository;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserResponse addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setLastLoginAt(LocalDateTime.now());
        user.setRole(UserRole.STUDENT);
        StudentRole studentRole = new StudentRole(user);

        studentRoleRepository.save(studentRole);
        return new UserResponse(user);
    }
}
