package com.iiitdmj.placement_portal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String log;
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "activity_id", nullable = false)
    @JsonIgnore
    private Activity activity;

}
