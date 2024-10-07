package com.iiitdmj.placement_portal.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serializable;
import java.util.Map;

public class RoleHierarchyEvaluator implements PermissionEvaluator {

    private static  final Map<String,Integer> Role_Hierarchy = Map.of(
            "ROLE_STUDENT", 1,
            "ROLE_TPR", 2,
            "ROLE_ADMIN", 3
    );
    @Override
    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        return hasRoleHigher(authentication, (String) permission);
    }

    private boolean hasRoleHigher(Authentication authentication, String role) {
        int requiredRoleLevel = Role_Hierarchy.get(role);
        for (GrantedAuthority authority: authentication.getAuthorities()) {
            int userRoleLevel = Role_Hierarchy.get(authority.getAuthority());
            if (userRoleLevel >= requiredRoleLevel) {
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        return hasRoleHigher(authentication, (String) permission);
    }



}
