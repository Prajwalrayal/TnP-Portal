package com.iiitdmj.placement_portal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.iiitdmj.placement_portal.constants.Position;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String email;

    @Column(nullable = false)
    private String firstName;
    private String lastName;

    private String description;

    private String linkedinUrl;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private Position position;

    @ElementCollection
    @CollectionTable(name = "client_mobile_numbers", joinColumns = @JoinColumn(name = "client_id"))
    @Column(name = "mobile_number")
    private List<String> mobileNumbers;
}
