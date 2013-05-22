var HomeController = {
    init: function() {
        
        
        
        $('.b.bguadeloupe').click(function(){
            app.mvc('ad',{'island':'1'});
        });
        $('.b.bmartinique').click(function(){
            app.mvc('ad',{'island':'2'});
        });
        $('.b.bguyane').click(function(){
            app.mvc('ad',{'island':'3'});
        });
        $('.b.breunion').click(function(){
            app.mvc('ad',{'island':'4'});
        });
        
        $('.button-info').click(function(){
            app.mvc('terms');
        });
        
        $('.button-config').click(function(){
            app.mvc('config');
        });
    }
};