package com.iiitdmj.placement_portal.service;

import com.iiitdmj.placement_portal.dto.ActivityDTO;
import com.iiitdmj.placement_portal.entity.Activity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ActivityService {
    Activity addActivity(Activity activity);

    List<Activity> getAllActivites();

    Activity updateActivity(ActivityDTO updateActivity, Integer id);
}
