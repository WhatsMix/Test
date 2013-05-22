package com.openeyes.opeyi;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class WebActivity extends Activity{
	
	private final class WebViewClientExtension extends WebViewClient {
		@Override
	    public boolean shouldOverrideUrlLoading(WebView view, String url) {
	        
	        return false;
	    }
	}

	public void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		setContentView(R.layout.web);
		
		WebView wv = (WebView)findViewById(R.id.webview);
		wv.loadUrl(getIntent().getExtras().getString("url"));
		
		WebSettings webSettings = wv.getSettings();
		webSettings.setJavaScriptEnabled(true);
		
		wv.setWebViewClient(new WebViewClientExtension());
	}
}
