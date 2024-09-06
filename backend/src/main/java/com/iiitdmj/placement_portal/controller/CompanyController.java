package com.iiitdmj.placement_portal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.iiitdmj.placement_portal.entity.Company;
import com.iiitdmj.placement_portal.service.CompanyService;

import java.util.List;

@RestController
@RequestMapping("/companies")
public class CompanyController {
  
  @Autowired
  private final CompanyService companyService;

  CompanyController(CompanyService companyService) {
    this.companyService = companyService;
  }

  @GetMapping("/")
  public List<Company> getAllCompanies() {
    return companyService.getAllCompanies();
  }

  @PostMapping("/")
  public Company addCompany(@Valid @RequestBody Company company) {
    return companyService.addCompany(company);  
  }

  @GetMapping("/{id}")
  public Company getCompanyById(@PathVariable Integer id) {
    return companyService.getCompanyById(id);
  }

  @PutMapping("/{id}")
  public Company updateCompany(@Valid @RequestBody Company company, @PathVariable Integer id) {
    return companyService.updateCompany(company, id);
  }
}
