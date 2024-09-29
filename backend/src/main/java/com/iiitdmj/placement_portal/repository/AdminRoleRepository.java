package com.iiitdmj.placement_portal.repository;

import com.iiitdmj.placement_portal.entity.AdminRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRoleRepository extends JpaRepository<AdminRole, String> {
}
