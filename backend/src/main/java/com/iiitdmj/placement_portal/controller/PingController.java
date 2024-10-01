package com.iiitdmj.placement_portal.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ping")
public class PingController {
    @GetMapping
    public String ping() {
        return "Hello World no sec needed";
    }

    @GetMapping("/protected")
    public String protectedPing() {
        return "Hello World normal login needed";
    }

    @PreAuthorize("hasPermission(null, 'ROLE_ADMIN')")
    @GetMapping("/admin_role")
    public String adminRole() {
        return "Hello World. Admins only";
    }

    @PreAuthorize("hasPermission(null, 'ROLE_TPR')")
    @GetMapping("/tpr_role")
    public String tprRole() {
        return "Hello World.. For the TPRs";
    }

    @PreAuthorize("hasPermission(null, 'ROLE_STUDENT')")
    @GetMapping("/student_role")
    public String studentRole() {
        return "Hello World. For the student";
    }
}