package com.iiitdmj.placement_portal.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.net.URL;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @NotNull
    private String name;
    private String email;
    private String description;
    private URL website;
    private String address;

    @ElementCollection
    @CollectionTable(name = "company_roles", joinColumns = @JoinColumn(name = "company_id"))
    @Column(name = "role")
    private List<String> rolesOffered;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private List<Salary> salaries; // One to many relationship with salary for different roles


}
