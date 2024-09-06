package com.iiitdmj.placement_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.iiitdmj.placement_portal.entity.Client;

public interface ClientRepository extends JpaRepository<Client, Integer> {
}
