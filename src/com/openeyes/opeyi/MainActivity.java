/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.openeyes.opeyi;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater.Factory;
import android.view.View;
import android.view.View.OnKeyListener;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.ImageView;
import android.widget.ImageView.ScaleType;
import android.widget.LinearLayout.LayoutParams;
import android.widget.ProgressBar;
import android.widget.Toast;

import org.apache.cordova.*;

import com.openeyes.opeyi.FacebookHelper.ShareListener;

public class MainActivity extends DroidGap implements FacebookHelper.LoginListener {

	public static ProgressDialog pd;
	Handler handler = new Handler();
	static MainActivity app;

	public static ImageView customSpashScreen;

	static String shareMessage = "";

	// public FacebookHelper.LoginListener.

	public void ok() {
		share();
	}

	public void share() {
		FacebookHelper.getInstance().share(shareMessage, new ShareListener() {

			@Override
			public void error() {
				Toast.makeText(getContext(), "impossible de contacter facebook", Toast.LENGTH_LONG).show();
			}

			@Override
			public void done() {
				Toast.makeText(getContext(), "poste sur facebook réussi", Toast.LENGTH_LONG).show();

			}
		});

	}

	public void error(String error) {

	}

	public void cancel() {

	}
	
	


	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		app = this;

		//pd = ProgressDialog.show(this, "", "Chargement");
		Log.d("xd", "********************************************");
		Log.d("xd", "********************************************");
		Log.d("xd", "********************************************");
		Log.d("xd", "********************************************");
		Log.d("xd", "********************************************");
		Log.d("xd", "********************************************");
		Log.d("xd", "********************************************");
		Log.d("xd", "********************************************");
		Log.d("xd", "********************************************");
		Log.d("xd", "********************************************");
		Log.d("xd", "********************************************");

		GCMIntentService.registerGCM(this);

		String basEUrl = "file:///android_asset/www/index.html";
		super.setIntegerProperty("loadUrlTimeoutValue", 160000);

		if (getIntent().getExtras() != null) {

			NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
			mNotificationManager.cancel(1663);

			String message = getIntent().hasExtra("message") ? getIntent().getExtras().getString("message") : null;
			String islands = getIntent().hasExtra("islands") ? getIntent().getExtras().getString("islands") : null;
			if (message != null)
				basEUrl += "?message=" + Uri.encode(message) + "&islands=" + Uri.encode(islands);

			/*
			 * if(message!=null){ AlertDialog.Builder builder = new
			 * AlertDialog.Builder(this); builder.setTitle("Nouveau message")
			 * .setMessage(message) .setPositiveButton("OK", new
			 * DialogInterface.OnClickListener() { public void
			 * onClick(DialogInterface dialog, int whichButton) {
			 * dialog.dismiss();
			 * 
			 * } }).create().show(); }
			 */
		}
		Log.d("xd", "basEUrl=" + basEUrl);

		//super.loadUrl(basEUrl);
		
		  // Init web view if not already done
		Log.d("xd","calling loadurl");
        if (this.appView == null) {
            this.init();
        }

        // Set backgroundColor
        //this.backgroundColor = this.getIntegerProperty("backgroundColor", Color.BLACK);
        this.root.setBackgroundColor(getResources().getColor(android.R.color.transparent));

        // If keepRunning
        this.keepRunning = this.getBooleanProperty("keepRunning", true);


        
        this.appView.loadUrl(basEUrl);

        appView.setOnKeyListener(new OnKeyListener() { 

            public boolean onKey(View v, int keyCode, KeyEvent event) {

               if (keyCode == KeyEvent.KEYCODE_BACK) {
            	   appView.loadUrl("javascript:app.pressOnBackKey()");
                  return true;

                }
             return onKeyDown(keyCode, event); 
          } 

       });
        
		// appView.clearCache(true);
		// appView.clearHistory();
		this.appView.setWebViewClient(new CordovaWebViewClient(this, this.appView) {

			@Override
			public void onLoadResource(WebView view, String url) {
				// Log.d("DEBUG", "onLoadResource" +url);
				// Implement your code

				/*
				 * if(url.contains("tel:")){ Toast.makeText(getContext(),
				 * "calling "+url.substring(4),Toast.LENGTH_SHORT); }else
				 */

				super.onLoadResource(view, url);

			}

			public void onReceivedError(WebView arg0, int arg1, String arg2, String url) {
				// super.onReceivedError(arg0, arg1, arg2, arg3);
				Log.d("xd", "webview error " + arg1 + " : " + arg2 + " : " + url);

				if (url.contains("?")) {// bug on certain phones
					app.loadUrl(url.substring(0, url.indexOf("?")));

					String message = url.substring(url.indexOf("?") + 9, url.indexOf("&islands="));
					if (message != null) {
						AlertDialog.Builder builder = new AlertDialog.Builder(app);
						builder.setTitle("Nouveau message").setMessage(Uri.decode(message)).setPositiveButton("OK", new DialogInterface.OnClickListener() {
							public void onClick(DialogInterface dialog, int whichButton) {
								dialog.dismiss();

							}
						}).create().show();
					}

				} else {
					Toast.makeText(app, "désolé, erreur de connexion", Toast.LENGTH_LONG).show();
				}
			}

			@Override
			public void onPageFinished(WebView view, String url) {

				// Log.d("DEBUG", "On page finished "+url);
				// Implement your code
				// pb.hide();
				if (MainActivity.pd != null) {
					MainActivity.pd.hide();
					/*
					 * if(MainActivity.customSpashScreen!=null){
					 * ((ViewGroup)MainActivity
					 * .customSpashScreen.getParent()).removeViewAt(0);
					 * MainActivity.customSpashScreen = null; }
					 */

				}
				super.onPageFinished(view, url);
			}

			@Override
			public boolean shouldOverrideUrlLoading(WebView view, String url) {

				Log.d("xd", "should override url loading " + url);

				if(url.indexOf("youtube.com") >= 0) {
					startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
					return true;
				}else if (url.indexOf("island:") >= 0) {
					SharedPreferences options = getSharedPreferences("options", Context.MODE_PRIVATE);
					Editor ed = options.edit();

					char number = url.charAt(16);
					char checked = url.charAt(17);

					// Toast.makeText(app, url+" = "+number+" "+checked,
					// Toast.LENGTH_LONG).show();
					ed.putBoolean("island" + number, checked == '1' ? true : false);
					ed.commit();

					return true;

				} else if (url.indexOf("facebook") >= 0) {

					shareMessage = url.substring(url.indexOf(":") + 1);
					FacebookHelper.init(getApplication(), "360072160776277", new String[] { "publish_stream" });

					if (!FacebookHelper.getInstance().isLoggedIn()) {
						FacebookHelper.getInstance().login(app, app);
					} else {
						share();
					}
					return true;
				} else {
					Intent i = new Intent(app, WebActivity.class);
					i.putExtra("url", url);
					startActivity(i);
					return true;
				}

				// Implement your code
				// return super.shouldOverrideUrlLoading(view, url);

			}

		});

		/*
		 * if(getIntent().getExtras()!=null){
		 * 
		 * NotificationManager mNotificationManager = (NotificationManager)
		 * getSystemService(Context.NOTIFICATION_SERVICE);
		 * mNotificationManager.cancel(1663);
		 * 
		 * String message =
		 * getIntent().hasExtra("message")?getIntent().getExtras
		 * ().getString("message"):null; if(message!=null){ AlertDialog.Builder
		 * builder = new AlertDialog.Builder(this);
		 * builder.setTitle("Nouveau message") .setMessage(message)
		 * .setPositiveButton("OK", new DialogInterface.OnClickListener() {
		 * public void onClick(DialogInterface dialog, int whichButton) {
		 * dialog.dismiss();
		 * 
		 * } }).create().show(); } }
		 */

	}
}