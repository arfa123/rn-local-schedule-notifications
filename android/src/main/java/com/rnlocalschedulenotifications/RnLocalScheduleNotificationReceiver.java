package com.rnlocalschedulenotifications;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/*
 * This is invoked by the Alarm Manager when it is time to display a scheduled notification.
 */
public class RnLocalScheduleNotificationReceiver extends BroadcastReceiver {
  @Override
  public void onReceive(Context context, Intent intent) {
    new RnLocalScheduleNotificationManager(context).displayScheduledNotification(intent.getExtras());
  }
}
