package com.iiitdmj.placement_portal.repository;

import com.iiitdmj.placement_portal.entity.User.TprRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TprRoleRepository extends JpaRepository<TprRole, String> {
}
