package com.iiitdmj.placement_portal.service;

import com.iiitdmj.placement_portal.constants.UserRole;
import com.iiitdmj.placement_portal.dto.UserResponse;
import com.iiitdmj.placement_portal.entity.User.AdminRole;
import com.iiitdmj.placement_portal.entity.User.StudentRole;
import com.iiitdmj.placement_portal.entity.User.TprRole;
import com.iiitdmj.placement_portal.entity.User.User;
import com.iiitdmj.placement_portal.repository.AdminRoleRepository;
import com.iiitdmj.placement_portal.repository.StudentRoleRepository;
import com.iiitdmj.placement_portal.repository.TprRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class UserServiceImplementation implements UserService {
    @Autowired
    private StudentRoleRepository studentRoleRepository;

    @Autowired
    private TprRoleRepository tprRoleRepository;

    @Autowired
    private AdminRoleRepository adminRoleRepository;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserResponse addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setLastLoginAt(LocalDateTime.now());

        if (user.getRole() == null) {
            user.setRole(UserRole.STUDENT);
        }

        switch (user.getRole()) {
            case STUDENT:
                StudentRole studentRole = new StudentRole(user);
                studentRoleRepository.save(studentRole);
                break;
            case TPR:
                TprRole tprRole = new TprRole(user);
                tprRoleRepository.save(tprRole);
                break;
            case ADMIN:
                AdminRole adminRole = new AdminRole(user);
                adminRoleRepository.save(adminRole);
                break;
            default:
                throw new IllegalArgumentException("Unknown role: " + user.getRole());
        }

        return new UserResponse(user);
    }
}
