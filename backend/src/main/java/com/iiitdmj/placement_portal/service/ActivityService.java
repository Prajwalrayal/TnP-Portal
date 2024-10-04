package com.iiitdmj.placement_portal.service;

import com.iiitdmj.placement_portal.dto.ActivityRequest;
import com.iiitdmj.placement_portal.dto.ActivityLogRequest;
import com.iiitdmj.placement_portal.dto.ActivityResponse;
import com.iiitdmj.placement_portal.entity.Activity;
import com.iiitdmj.placement_portal.entity.ActivityLog;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ActivityService {
    ActivityResponse addActivity(ActivityRequest activity);

    List<ActivityResponse> getAllActivites();

    Activity updateActivity(ActivityRequest updateActivity, Integer id);

    ActivityLog addLog(ActivityLogRequest activityLogRequestDTO);

    List<ActivityLog> getLogsByActivityId(Integer id);
}
