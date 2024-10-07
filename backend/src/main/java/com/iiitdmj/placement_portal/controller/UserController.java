package com.iiitdmj.placement_portal.controller;

import com.iiitdmj.placement_portal.constants.UserRole;
import com.iiitdmj.placement_portal.dto.UserResponse;
import com.iiitdmj.placement_portal.entity.User;
import com.iiitdmj.placement_portal.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        UserResponse createdUser = userService.addUser(user);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdUser.getEmail())
                .toUri();
        return ResponseEntity.created(location).body(createdUser);
    }

    @PostMapping("/assign-role")
    public UserResponse assignRole(@RequestParam String userEmail, @RequestParam UserRole role) {
        return userService.assignRole(userEmail, role);
    }
}