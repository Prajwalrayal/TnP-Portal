package com.iiitdmj.placement_portal.repository;

import com.iiitdmj.placement_portal.constants.UserRole;
import com.iiitdmj.placement_portal.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
    Page<User> findByRole(UserRole role, Pageable pageable);
}
