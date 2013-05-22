/**
* xdesign 2012
*/
package com.openeyes.opeyi;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;


import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gcm.GCMBaseIntentService;
import com.google.android.gcm.GCMRegistrar;

/**
 * 
 * @author jb
 */
public class GCMIntentService extends GCMBaseIntentService {

	public static Context service ;
	public static ArrayList<Integer> notificationIds = new ArrayList<Integer>();
    static String TAG = "GCMIntentService:";
    
    
    /*
     * : Called when your server sends a message to GCM, and GCM delivers it to the device. 
     * If the message has a payload, its contents are available as extras in the intent.
     */
    @Override
    protected void onMessage(Context cntxt, Intent intent) {
    	Log.d("xd","GCM message intent = "+intent.getExtras().toString());
    	String message = intent.getExtras().getString("message");
    	Log.d("xd","message = "+message);
    	String[] parts = message.split("______");
    	for(String p : parts)
    		Log.d("xd","message = "+p);
    	/*Intent i =new Intent(cntxt,com.openeyes.opeyi.MainActivity.class );
    	i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    	startActivity(i);*/
    	
    	 SharedPreferences options = getSharedPreferences("options", Context.MODE_PRIVATE);
    	 
    	 boolean good = false;
    	 for(int i =0;i<parts[1].length();i++){
    		 char island = parts[1].charAt(i);
    		 Log.d("xd","condition island ="+island);
    		 if(!options.contains("island"+island) || options.getBoolean("island"+island, false)){
    			 good = true;
    		 }
    	 }
    	 
    	 if(!good)
    		 return;
    	 
    	 Log.d("xd","condition island = GOOOODd");
    	
    	
    	  NotificationCompat.Builder mBuilder =
                  new NotificationCompat.Builder(this)
                  .setSmallIcon(R.drawable.appicon)
                  .setContentTitle("Nouveau message")
                  .setContentText(parts[2]);
          // Creates an explicit intent for an Activity in your app
          Intent resultIntent = new Intent(this, MainActivity.class);
          resultIntent.putExtra("message", parts[2]);
          resultIntent.putExtra("islands", parts[1]);

          // The stack builder object will contain an artificial back stack for the
          // started Activity.
          // This ensures that navigating backward from the Activity leads out of
          // your application to the Home screen.
          TaskStackBuilder stackBuilder = TaskStackBuilder.create(this);
          // Adds the back stack for the Intent (but not the Intent itself)
          stackBuilder.addParentStack(MainActivity.class);
          // Adds the Intent that starts the Activity to the top of the stack
          stackBuilder.addNextIntent(resultIntent);
          PendingIntent resultPendingIntent =
                  stackBuilder.getPendingIntent(
                      0,
                      PendingIntent.FLAG_UPDATE_CURRENT
                  );
          mBuilder.setContentIntent(resultPendingIntent);
          NotificationManager mNotificationManager =
              (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
          // mId allows you to update the notification later on.
          mNotificationManager.notify(1663, mBuilder.build());
    }

    
   
    /**
     * onError(Context context, String errorId): 
     * Called when the device tries to register or unregister, but GCM returned an error. 
     * Typically, there is nothing to be done other than evaluating the error (returned by errorId) and trying to fix the problem.
     */
    @Override
    protected void onError(Context cntxt, String string) {
        Log.d("xd",TAG+"onError:"+string);
    }

    
    /*
     * onRegistered(Context context, String regId): 
     * Called after a registration intent is received, passes the registration ID assigned by GCM to that device/application pair as parameter. 
     * Typically, you should send the regid to your server so it can use it to send messages to this device.
     */
    @Override
    protected void onRegistered(final Context cntxt, String string) {
        Log.d("xd","REGISTERED ="+TAG+string);
        
        new Thread(new Runnable() {
			
			@Override
			public void run() {
				try{
				HttpURLConnection connection = null;
				TelephonyManager tManager = (TelephonyManager)getSystemService(Context.TELEPHONY_SERVICE);
				String uuid = tManager.getDeviceId();
				Log.d("xd","http://opeyi.net/mobile/api.php?controller=infos&action=registerGCM&token="+GCMRegistrar.getRegistrationId(cntxt)+"&uuid="+uuid);
				URL urlObject = new URL("http://opeyi.net/mobile/api.php?controller=infos&action=registerGCM&token="+GCMRegistrar.getRegistrationId(cntxt)+"&uuid="+uuid);
				connection = (HttpURLConnection)urlObject.openConnection();

	            connection.setConnectTimeout(120);
	            //connection.setReadTimeout(timeout);
	            
	            int status = connection.getResponseCode();
	            String content="";

	            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
	            String str;
	            while ((str = in.readLine()) != null) {
	                content += str;
	            }
	            in.close();
			}	
			 catch (Exception e) {
				e.printStackTrace();
				Log.e("xd", TAG + "GCM crash " + e.getMessage()+" "+e.toString()+" "+e.getClass().toString());
			}
			}
		}).start();
    }
    
    static String gcmKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiZ3HvgPg/b4LIFz5+a/BFD2Zcl110yMYI7+MzI+scpKDTN0o9UPh4LxskZ0o8JWXwJUtuU36l8Ki0uNW1QU4nBB0Wh/2EQX1ogNIGub7s4h4MBEdaBj0zV7JkL122N2VBoZSx2T05dPaCOetKwWG/7A4svyPbg+0gM9CQDTS0Ufr6208pw4KIlKcS5j3Jn9voKplGl0Ip11i8rGD10RYxHgZ1PxHxzyu7UWNh1c1lchw5+0OXwL+T76Xk5W3tPPDTUWRxevpXOlzrnle+bcWDb9Z2iyylvzxtUznicLBbu3UIJRLpPfZEbI+eYsaCDX/IPtwCzijydrjJY5KwAn4DQIDAQAB";
    
    public static void registerGCM(final Context ct) {
    	service = ct;
		// GCM
		try {

			GCMRegistrar.checkDevice(ct);
			GCMRegistrar.checkManifest(ct);
			String regId = GCMRegistrar.getRegistrationId(ct);
	
			if (regId.equals("")) {
				GCMRegistrar.register(ct, "272763641971");//
				android.util.Log.d("xd","GCM already REGISTERING " );
			} else {
				android.util.Log.d("xd","GCM already registered " + regId);
			}


		} catch (Exception e) {
			e.printStackTrace();
			Log.e("xd", TAG + "GCM crash " + e.getMessage()+" "+e.toString()+" "+e.getClass().toString());
		}
	}

     /**
     * onUnregistered(Context context, String regId): Called after the device has been unregistered from GCM. 
     * Typically, you should send the regid to the server so it unregisters the device.

     */
    @Override
    protected void onUnregistered(Context cntxt, String string) {
    	Log.d("xd",TAG+"onUnregistered:"+string);
    }

}
