package com.openeyes.opeyi;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;

import com.facebook.android.AsyncFacebookRunner;
import com.facebook.android.DialogError;
import com.facebook.android.Facebook;
import com.facebook.android.FacebookError;

public class FacebookHelper {

	static Application context;
	static String appId;
	static String[] permissions;
	Context mycontext;
	Facebook fb;
	String token;
	long expires;
	SharedPreferences mPrefs;
	private static FacebookHelper instance = null;

	public static void init(Application acontext, String anAppId, String[] thepermissions) {
		context = acontext;
		appId = anAppId;
		permissions = thepermissions;
		if (instance == null) {
			instance = new FacebookHelper(acontext.getSharedPreferences("facebook", Context.MODE_PRIVATE));
		}
	}

	public static FacebookHelper getInstance() {
		return instance;
	}

	public void setActivity(Context context) {
		mycontext = context;
	}

	private FacebookHelper(SharedPreferences mp) {
		fb = new Facebook(appId);
		// load saved info
		mPrefs = mp;
		String access_token = mPrefs.getString("access_token", null);
		expires = mPrefs.getLong("access_expires", 0);
		if (access_token != null) {
			fb.setAccessToken(access_token);
		}
		if (expires != 0) {
			fb.setAccessExpires(expires);
		}
	}

	public void authorizeCallback(int requestCode, int resultCode, Intent data) {
		fb.authorizeCallback(requestCode, resultCode, data);
	}

	public String getAccessToken() {
		return fb.getAccessToken();
	}

	public void setExpired() {
		fb.setAccessExpires(1);
	}

	public boolean isLoggedIn() {
		return fb.isSessionValid();
	}

	public interface ShareListener {

		public void done();

		public void error();
	}


	public void share(String message, final ShareListener listener) {

		Bundle query = new Bundle();
		query.putString("message", message);

		if (!fb.isSessionValid()) {
			Log.e("xd", "session invalid");
			listener.error();
			return;
		}

		final AsyncFacebookRunner api = new AsyncFacebookRunner(fb);

		api.request("me/feed", query, "POST", new AsyncFacebookRunner.RequestListener() {
			public void onComplete(String string, Object o) {

				try {
					final JSONObject $o = new JSONObject(string);
					Log.d("xd", "facebook.share :" + $o.toString());
					if ($o.has("error")) {

						listener.error();
					} else {
						listener.done();
					}
				} catch (JSONException ex) {
					ex.printStackTrace();
					listener.error();
				}
			}

			public void onIOException(IOException e, Object o) {
				e.printStackTrace();
				listener.error();
			}

			public void onFileNotFoundException(FileNotFoundException e, Object o) {
				e.printStackTrace();
				listener.error();
			}

			public void onMalformedURLException(MalformedURLException e, Object o) {
				e.printStackTrace();
				listener.error();
			}

			public void onFacebookError(FacebookError e, Object o) {
				e.printStackTrace();
				listener.error();
			}
		}, null);
	}
	
	

	public interface LogoutListener {

		public void ok();

		public void error(String error);
	}

	public void logout(final LogoutListener listener) {
		new Thread(new Runnable() {

			@Override
			public void run() {
				if (!fb.isSessionValid()) {
					listener.ok();
					return;
				}
				try {
					fb.logout(mycontext);
					listener.ok();
				} catch (Exception e) {
					e.printStackTrace();
					listener.error(e.getMessage());
				}
			}
		}).start();

	}

	public void login(final Activity activity, final LoginListener listener) {

		if (fb.isSessionValid()) {
			listener.ok();
			return;
		}
		fb.authorize(activity, permissions, new Facebook.DialogListener() {
			public void onComplete(Bundle values) {
				if (values.containsKey("error")) {
					fb.setAccessExpires(1);
					fb.authorize(activity, permissions, this);
					return;
				}

				// save info
				token = values.getString("access_token");
				expires = Long.parseLong(values.getString("expires_in"));

				SharedPreferences.Editor editor = mPrefs.edit();
				editor.putString("access_token", fb.getAccessToken());
				editor.putLong("access_expires", fb.getAccessExpires());
				editor.commit();

				if (token != null) {
					//App.updateUserFacebookLogin(token);
				}

				listener.ok();
			}

			public void onFacebookError(FacebookError e) {
				Log.e("xd", "fb::onFacebookError");
				listener.error(e.getMessage());
			}

			public void onError(DialogError e) {
				Log.e("xd", "fb::onError");
				e.printStackTrace();
				listener.error(e.getMessage());
			}

			public void onCancel() {
				Log.e("xd", "fb::onCancel");
				listener.cancel();
			}
		});
	}

	public interface LoginListener {

		public void ok();

		public void error(String error);

		public void cancel();
	}
}