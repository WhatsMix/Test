package com.openeyes.opeyi;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;

public class SplashActivity extends Activity{

	ProgressDialog progress;
	public void onCreate(Bundle s){
		super.onCreate(s);
		
		setContentView(R.layout.splash);
		progress = new ProgressDialog(this);
		progress.setTitle("");
		progress.setMessage("chargement...");
	}
	
	public void onResume(){
		super.onResume();
		
		if(!progress.isShowing())
			progress.show();
		
		startActivity(new Intent(this,MainActivity.class));
	}
	
}
