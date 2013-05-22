
var Android={
    init:function(){
    	Android.unitTest();
    	
		var info = Android.calculateZoomLevel($(window).width(),$(window).height());
       console.log("zoom info :"+info['level'] +" for "+$(window).width()+"*"+$(window).height()+" : "+info['width']+"*"+info['height']+" "+info['w']+"*"+info['h']);
           
        $('body').css({
            zoom: info['level'],
            'top':info['h']-2,
            'left':info['w']-2,
            'position':'absolute',
            'overflow':'hidden'
        }); // width of the design / width of the screen
        $('#app,#loading,#loading-background').css({
           //	'top':info['h'],
           // 'left':info['w'],
            'overflow':'hidden'
        });
        $('#loading').css({
        	'margin-left': '220px'
        });
        
         $('body').addClass('special-android')
    },
    calculateZoomLevel:function(width,height){
	    var limitW=640;
	    var limitH = 920;
	    
		var zoomLevel = 1;
		
		// shrinking = zoomLevel must be < 1
		if(height*zoomLevel>limitH){
    		while(height*zoomLevel>limitH && width*zoomLevel>limitW){
	        	zoomLevel -=  0.005;
	        }
	        zoomLevel+=0.005;
	    // making it bigger = zoomlevel must be > 1
		}else{
			while(height*zoomLevel<limitH || width*zoomLevel<limitW){
	        	zoomLevel +=  0.005;
	        }
	        zoomLevel-=0.005;
		}
    		
    		
        var h = (height-(limitH/zoomLevel))/2;
    	var w = (width-(limitW/zoomLevel))/2;
    
    	return {'width':limitW/zoomLevel,'height':limitH/zoomLevel,'level':1/zoomLevel,h:h,w:w,oWidth:width,oHeight:height}
    },
    
    unitTest:function(){
    	var tests= [
    		
    		[320,480],
    		[480,800],
    		[480,854],
    		[800,1280]
    	]
    	for(i in tests){
    		var info = Android.calculateZoomLevel(tests[i][0],tests[i][1]);
    		
    		console.log(tests[i][0]+"*"+tests[i][1]);
    		console.log(info);
    		if(parseInt(info['width']+info['w'])>tests[i][0] || parseInt(info['height']+info['h'])>tests[i][1])
    			console.log('FAIL');
    	}
    	console.log('/unittest');
    }
}