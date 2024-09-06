package com.iiitdmj.placement_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.iiitdmj.placement_portal.entity.User;

public interface UserRepository extends JpaRepository<User, String> {
}
