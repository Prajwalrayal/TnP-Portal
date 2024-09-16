package com.iiitdmj.placement_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.iiitdmj.placement_portal.entity.Company;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {
}
