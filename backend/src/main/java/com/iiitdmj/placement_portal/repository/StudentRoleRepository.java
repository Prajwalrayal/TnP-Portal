package com.iiitdmj.placement_portal.repository;

import com.iiitdmj.placement_portal.entity.User.StudentRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRoleRepository extends JpaRepository<StudentRole, String> {
}
