package com.iiitdmj.placement_portal.service;

import com.iiitdmj.placement_portal.dto.UserResponse;
import com.iiitdmj.placement_portal.entity.User.User;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    UserResponse addUser(@Valid User user);
}