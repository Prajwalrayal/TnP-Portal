package com.iiitdmj.placement_portal.service;

import org.springframework.stereotype.Service;

import com.iiitdmj.placement_portal.entity.Company;

import java.util.List;

@Service
public interface CompanyService {
  public List<Company> getAllCompanies();
  public Company addCompany(Company company);
  public Company getCompanyById(Integer id);
  public Company updateCompany(Company company, Integer id);
}
