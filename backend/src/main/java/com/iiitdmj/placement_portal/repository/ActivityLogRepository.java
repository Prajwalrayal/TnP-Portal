package com.iiitdmj.placement_portal.repository;

import com.iiitdmj.placement_portal.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog,Integer> {
    @Query("SELECT al FROM ActivityLog al WHERE al.activity.id = :activityId")
    List<ActivityLog> findByActivityId(@Param("activityId") Integer activityId);
}
