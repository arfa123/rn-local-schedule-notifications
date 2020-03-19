package com.rnlocalschedulenotifications;

import android.content.Intent;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import javax.annotation.Nullable;

import static com.rnlocalschedulenotifications.RnLocalScheduleBackgroundNotificationActionReceiver.isBackgroundNotficationIntent;
import static com.rnlocalschedulenotifications.RnLocalScheduleBackgroundNotificationActionReceiver.toNotificationOpenMap;

public class RnLocalScheduleBackgroundNotificationActionsService extends HeadlessJsTaskService {
  @Override
  protected @Nullable
  HeadlessJsTaskConfig getTaskConfig(Intent intent) {
    if (isBackgroundNotficationIntent(intent)) {
      WritableMap notificationOpenMap = toNotificationOpenMap(intent);

      return new HeadlessJsTaskConfig(
        "RnLocalScheduleBackgroundNotificationAction",
        notificationOpenMap,
        60000,
        true
      );
    }
    return null;
  }
}
