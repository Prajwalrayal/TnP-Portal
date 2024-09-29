package com.iiitdmj.placement_portal.service;

import com.iiitdmj.placement_portal.dto.ActivityDTO;
import com.iiitdmj.placement_portal.dto.ActivityLogDTO;
import com.iiitdmj.placement_portal.dto.ActivityResponse;
import com.iiitdmj.placement_portal.entity.Activity;
import com.iiitdmj.placement_portal.entity.ActivityLog;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ActivityService {
    ActivityResponse addActivity(ActivityDTO activity);

    List<ActivityResponse> getAllActivites();

    Activity updateActivity(ActivityDTO updateActivity, Integer id);

    ActivityLog addLog(ActivityLogDTO activityLogDTO);

    List<ActivityLog> getLogs(Integer id);
}
