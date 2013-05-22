/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.openeyes.opeyi;


import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;
import android.util.Log;


/**
 * 
 * @author jb
 */
public class NotificationHelper {

	static String TAG = "NotificationHelper:";
	static NotificationHelper instance = null;
	public static Context context;

	public static void init(Context acontext) {
		context = acontext;
	}

	public static NotificationHelper getInstance() {
		if (instance == null) {
			instance = new NotificationHelper();
		}
		return instance;
	}

	private NotificationHelper() {
	}

	private static int count = 1;
	
	public int send(int mid,String title, String description, int icon, Intent resultIntent, Class c, boolean permanent) {
		NotificationCompat.Builder builder = new NotificationCompat.Builder(context).setContentTitle(title).setContentText(description).setSmallIcon(icon);// ?icon:R.drawable.ic_placeholder
		// BitmapDrawable d =
		// (BitmapDrawable)context.getResources().getDrawable(icon);
		// builder.setLargeIcon(d.getBitmap());

		// The stack builder object will contain an artificial back stack for
		// the
		// started Activity.
		// This ensures that navigating backward from the Activity leads out of
		// your application to the Home screen.
		TaskStackBuilder stackBuilder = TaskStackBuilder.create(context);
		// Adds the back stack for the Intent (but not the Intent itself)
		if(stackBuilder==null)
			Log.d("xd","WTF");
		stackBuilder.addParentStack(c);
		// Adds the Intent that starts the Activity to the top of the stack
		stackBuilder.addNextIntent(resultIntent);
		PendingIntent resultPendingIntent = stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);
		builder.setContentIntent(resultPendingIntent);
		NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
		// mId allows you to update the notification later on.

		int id = mid;
		Notification n = builder.build();
		if (permanent) {
			n.flags = Notification.FLAG_ONGOING_EVENT;
			n.flags = Notification.FLAG_NO_CLEAR;
		} else {
			n.flags = Notification.FLAG_AUTO_CANCEL;
		}
		// n.when = 0;
		mNotificationManager.notify(id, n);

		return id;

	}

	public void removeNotification(int nId) {
		NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
		mNotificationManager.cancel(nId);
	}
}
