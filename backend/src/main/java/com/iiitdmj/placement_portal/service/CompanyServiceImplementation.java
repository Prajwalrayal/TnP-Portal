package com.iiitdmj.placement_portal.service;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.iiitdmj.placement_portal.entity.Company;
import com.iiitdmj.placement_portal.repository.CompanyRepository;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class CompanyServiceImplementation implements CompanyService {
  @Autowired
  private CompanyRepository companyRepository;

  CompanyServiceImplementation(CompanyRepository companyRepository) {
    this.companyRepository = companyRepository;
  }

  @Override
  public List<Company> getAllCompanies() {
    return companyRepository.findAll();
  }

  @Override
  public Company addCompany(Company company) {
    return companyRepository.save(company); 
  }

  @Override
  public Company getCompanyById(Integer id) {
    return companyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
  }

  @Override
  public Company updateCompany(Company company, Integer id) {
    Company currentCompany = companyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));

    currentCompany.setName(company.getName());
    currentCompany.setEmail(company.getEmail());
    currentCompany.setDescription(company.getDescription());
    currentCompany.setWebsite(company.getWebsite());

    return companyRepository.save(currentCompany);
  }
}
