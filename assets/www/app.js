/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Initial execution
var app = {
    defaultController: 'home',
    apiUrl:'http://opeyi:changevotrequotidien@opeyi.net/mobile/api.php?',
    fileUrl:'http://opeyi.net/mobile/',
    infos: null,
    adDelay: 2100,
    DEV: true,
    ANDROID: true,
    init: function() {
    	
    	if(window.localStorage){
    		var authIslands = window.localStorage.islands;
    		if(!authIslands)
    			 window.localStorage.islands = 'x1234';
    			 
    		var url = document.location.search;
		    	if(url.indexOf('?message=null')<0){
		    		// we have a message
		    		 var arrParams = url.split("?");   
		    		 if(arrParams.length>1){ 
			       var arrURLParams = arrParams[1].split("&");      
			       var arrParamNames = new Array(arrURLParams.length);
			       var arrParamValues = new Array(arrURLParams.length);  
			       for (i=0;i<arrURLParams.length;i++)
			       {
			        var sParam =  arrURLParams[i].split("=");
			        arrParamNames[i] = sParam[0];
			        if (sParam[1] != "")
			            arrParamValues[i] = unescape(sParam[1]);
			        else
			            arrParamValues[i] = "No Value";
			       }
			       
			       //alert("received message for islands "+arrParamValues[1]);
		       
		       		 
		       		  var show = false;
		       		  for(i=0;i<window.localStorage.islands.length;i++){
		       		  		if(window.localStorage.islands[i]=='1' && arrParamValues[1].indexOf(i)>=0)
		       		  			show = true
		       		  }
		       		  
		       		  if(show)alert(arrParamValues[0])
		    	}
		    	}
    	}
    	
    	
        $(document).ready(function() {
            if(app.ANDROID){
                Android.init()
            }
            else if($(window).height()>=1096){
                $('body').addClass('r4i');
            }
            db.init('com.openeyes.opeyi');
            db.firstTime(function(itIs){
                if(itIs){     
                    app.mvc('config');
                }else
                    app.mvc(app.defaultController);
            });
            
            $('.button-home,.button-logo').live('click touchstart',function(){
                app.mvc(app.defaultController,{},true);
            });
            api.query("controller=infos",function(json){
                app.infos = (json)
                
                
            });
        });
        document.addEventListener("deviceready", app.onDeviceReady);
    },
    pressOnBackKey: function(){
   		$('#page .button-back').trigger('click')
    },
    onDeviceReady: function() {
    },
    domPopup: null,
    domPopupContent: null,
    popup: function(html,handler) {
        if (!this.domPopup) {
            this.domPopup = $('<div id="popup"></div>');
            this.domPopupContent = ($('<div id="popup-content"></div>').html(html));
            this.domPopupCloser = $('<div id="popup-closer"></div>');
            this.domPopupCloser.click(function() {
                app.closePopup();
            });
            $('body').append(this.domPopup);
            $('body').append(this.domPopupContent);
            $('body').append(this.domPopupCloser);
        } else {
            this.domPopupContent.html(html);
        }
        if (html && html.fadeIn)
            html.fadeIn();
        this.domPopup.fadeIn(handler);
        this.domPopupContent.fadeIn();
        this.domPopupCloser.fadeIn();
    },
    closePopup: function() {
        if (this.domPopup) {
            this.domPopup.fadeOut();
            this.domPopupContent.fadeOut();
            this.domPopupCloser.fadeOut();
        }
    },
    error: function(mesg) {
        alert(mesg);
    },
    lastController: false,
    controller: function(name,options){
        
        
        console.log("MVC : "+name)
        //console.log(options)
        app.lastController = name;
        switch (name) {
            case 'home':
                HomeController.init();
                break;
            case 'config':
                ConfigController.init();
                break;
            case 'categories':
                CategoriesController.init(options);
                break;
            case 'terms':
                TermsController.init();
                break;
            case 'listing':
                ListingController.init(options);
                break;
            case 'event':
                EventController.init(options);
                break;
            case 'ad':
                AdController.init(options);
                break;
            case 'message':
                MessageController.init(options);
                break;
            case 'search':
                SearchController.init(options);
                break;
            case 'contact':
                ContactController.init(options);
                break;
        }
    },
    controllerStop: function(){
        
    },
    mvcTransition: false,
    mvc: function(name,options,transitionToRight) {
        if(app.ANDROID){
            return app.mvcAndroid(name, options, transitionToRight);
        }else{
            return app.mvcIos(name, options, transitionToRight);
        }
    },
    mvcAndroid: function(name,options,transitionToRight) {
        transitionToRight = transitionToRight == true? true:false;
        $('#toast').fadeOut();
        if(app.mvcTransition)return;
        app.controllerStop();
        console.log("mvc android = "+name);
        $.ajax({
            url: 'view/' + name + '.html',
            error: function(e) {
                console.log($(e))
            },
            dataType: "html",
            success: function(html) {
                // first time
                if($('#view').hasClass('loading')){
                    
                    $('#view').removeClass('loading');
                    $('#view').empty();
                    $('#view').html(html);
                    app.controller(name,options);
                    
                    $('#view').css({
                        position:'absolute',
                        'top':'0px',
                        'left':'0px'
                    });
                // use transition 
                }else{
                    if(app.mvcTransition)return;
                    app.mvcTransition = true;
                    
                    
                    var currentView =  $('#view');
                    currentView.css({// just to be sure
                        'position':'absolute',
                        'width':'640px',
                        'overflow':'hidden !important',
                        'left':'0px',
                        'top':'0px',
                        'z-index':'2'
                    });
                    
                    currentView.fadeOut(function(){
                    	currentView.html(html);
	                    switch(name){
	                        case 'search':
	                            SearchController.willAppear(options);
	                            appeared = true;
	                            break;
	                        case 'ad':
	                            AdController.willAppear(options.island);
	                            break;
	                        case 'categories':
	                            if(options.island)
	                                $('#page.categories').addClass('island-'+options.island);
	                            break;
	                    }
	                    
	                    
	                    currentView.fadeIn(function(){
	                    	app.controller(name,options);
	                    	app.mvcTransition  = false;
	                    });
	                     
                    });
                }
            }
        });
    },
    mvcIos: function(name,options,transitionToRight) {
        transitionToRight = transitionToRight == true? true:false;
        $('#toast').fadeOut();
        if(app.mvcTransition)return;
        $.ajax({
            url: 'view/' + name + '.html',
            error: function(e) {
                console.log($(e))
            },
            dataType: "html",
            success: function(html) {
                // first time
                if($('#view').hasClass('loading')){
                    
                    $('#view').removeClass('loading');
                    $('#view').empty();
                    $('#view').html(html);
                    app.controller(name,options);
                    
                    $('#view').css({
                        position:'absolute',
                        'top':'0px',
                        'left':'0px'
                    });
                // use transition to left
                }else if(transitionToRight){
                    if(app.mvcTransition)return;
                    
                    app.mvcTransition = true;
                  
                    
                    var currentView =  $('#view');
                    currentView.css({// just to be sure
                        'position':'absolute',
                        'width':'640px',
                        'overflow':'hidden !important',
                        'left':'0px',
                        'top':'0px',
                        transform:'rotateY(0deg)',
                        'z-index':'2'
                    }); 
                    
                    // create a transition page, with the good content
                    var page = $('<div id="#view-transition"></div>');
                    page.css({
                        'position':'absolute',
                        'left':'0px',
                        'top':'0px',
                        transform:'rotateY(90deg)',
                        '-webkit-backface-visibility': 'hidden;'
                    });
                    $('#app').append(page);
                    
                    
                    page.html(html);
                    switch(name){
                        case 'search':
                            SearchController.willAppear(options);
                            appeared = true;
                            break;
                        
                    
                        case 'home':
                            break;
                        case 'categories':
                            if(options.island)
                                $('#page.categories').addClass('island-'+options.island);
                            break;
                    }
                    // move current view to the left, and the transition one as well
                    
                    currentView.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                        currentView.hide();
                        currentView.remove();
                        page.attr('id','view')
                        page.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                            switch(name){
                                case 'listing':
                                    $('.buttons-categories').hide();
                            
                                    break;
                            }
                            app.mvcTransition = false;
                            app.controller(name,options);
                            page.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
                        });
                        page.css({
                            transition: 'transform 1s',
                            transform:'rotateY(0deg)'
                        });
                    });
                    app.controllerStop();
                    currentView.css({
                        transition: 'transform 1s',
                        transform:'rotateY(-90deg)'
                    });
                    
                } else{
                    
                    if(app.mvcTransition)return;
                    app.mvcTransition = true;
                    
                    
                    var currentView =  $('#view');
                    currentView.css({// just to be sure
                        'position':'absolute',
                        'width':'640px',
                        'overflow':'hidden !important',
                        'left':'0px',
                        'top':'0px',
                        transform:'rotateY(0deg)',
                        'z-index':'2'
                    }); 
                    
                    // create a transition page, with the good content
                    var page = $('<div id="#view-transition"></div>');
                    page.css({
                        'position':'absolute',
                        'left':'0px',
                        'top':'0px',
                        transform:'rotateY(-90deg)',
                        '-webkit-backface-visibility': 'hidden;'
                    });
                    $('#app').append(page);
                    
                    page.html(html);
                    switch(name){
                        case 'search':
                            SearchController.willAppear(options);
                            appeared = true;
                            break;
                        case 'ad':
                            AdController.willAppear(options.island);
                            break;
                        case 'categories':
                            if(options.island)
                                $('#page.categories').addClass('island-'+options.island);
                            break;
                    }
                    // move current view to the left, and the transition one as well
                    currentView.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                        currentView.hide();
                        currentView.remove();
                        page.attr('id','view')
                        page.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                            app.controller(name,options);
                            app.mvcTransition = false;
                            page.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
                        });
                        page.css({
                            transform:'rotateY(0deg)'
                        });
                    });
                    app.controllerStop();
                    currentView.css({
                        transform:'rotateY(90deg)'
                    });
                }
            }
        });
    },
    open: function(src){
        //app.loading(true);
        /*$('#iframe iframe').attr('src',src);
        $('#iframe').fadeIn(function(){
            app.loading(false);
        });*/
        var ref = window.open(src,'_blank','location=yes');
    },
    toastInterval: null,
    toast: function(msg){
        $('#toast').html(msg);
        $('#toast').bind('click',function(){
            $('#toast').fadeOut();
        });
        $('#toast').fadeIn();
        toastInterval = setInterval(function(){
            $('#toast').fadeOut();
            clearInterval(toastInterval);
            toastInterval=  null;
        },3000);
    },
    closableToast: function(msg){
        $('#toast').html(msg);
        $('#toast').fadeIn();
        $('#toast').bind('click',function(){
            $('#toast').fadeOut();
        });
    },
    toastError: function(error){
        app.toast(error?error:"désolé, vous n'êtes pas connecté à Internet");  
    },
    loadingCount: 0,
    loading: function(show){
        if(show){
            $('#loading-background').fadeIn();
            $('#loading').fadeIn();
        }else{            
            $('#loading-background').fadeOut();
            $('#loading').fadeOut();
        }
    },
    template: function(templateName){
        return $($('.template.original.'+templateName).get(0)).clone().removeClass('original');
    }
};