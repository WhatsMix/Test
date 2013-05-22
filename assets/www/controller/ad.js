var AdController = {
    
    interval: false,
    init: function(options) {
        var i=setInterval(function(){
            if(!AdController.interval)
                app.mvc('categories',{island:options.island});
            AdController.interval = true;
            clearInterval(i);
        },app.adDelay);
    },
    willAppear: function(island){
        AdController.interval = false;
        $img = $('#ad img.island'+island).clone();
        
        $w = 640-($('#ad img').width());
        $h = 920-($('#ad img').height());
        $img.css({
            'margin-left':$w/2,
            'margin-top':$h/2
        });
        $('#page.ad').append($img);
    }
};