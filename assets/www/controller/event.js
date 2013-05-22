var EventController = {
    init: function(options) {// {id,options}
        if(!options)
            options={
                id:489,
                category:2,
                island:1,
                options:{
                    category:2
                }
            }
        // console.log(options)   
            
        if(options.options.category=='1')
            $('.date').hide();
            
        $('#page.event .button-back').click(function(){
            app.mvc('listing',options.options,true)
        });
        
        
    
        $('.button-video').hide();
        $('.button-booking').hide();
        $('.button-message').hide();
        $('.button-message-read').hide();
        $('.button-message-read').hide();
        $('.button button-buzz').hide();
        
        
        
        api.query("controller=event&action=id&id="+options.id, function(json){
            
            console.log(json)
            var event = json.event;
            $('.maintitle').html(ListingController.categories[options.options.category]);
            if(event.eventDate)
                $('.date').html(tools.formatDateDayAndStringMonth(event.eventDate));
            $('.title').html(event.place);
            $('.event img').attr({
                src: app.fileUrl+"upload/"+event.urlFlyer
            });
            $('.event .text').html(event.description);
            
            if(event.urlBuy.length>0){// urlBuy = video
                $('.button-video').show();
                $('.button-video').click(function(){
                    
                        $(this).addClass('selected');
                  // if(event.internetButton=='internet')
                    	app.open(event.urlBuy);
                    /*	else
                    	app.mvc('youtube',{src:event.urlBuy});*/
                });
                if(event.internetButton=='internet')
                    $('.button-video').addClass('internet')
              
            }
            
            if(event.urlBuyText.length>0){// urlBuyTexte = reserver
                $('.button-booking').show();
                $('.button-booking').click(function(){
                    $(this).addClass('selected');
                    app.open(event.urlBuyText);
                });
                if(event.buyButton=='acheter')
                    $('.button-booking').addClass('buy')
            }
            // console.log(event)
            
            if(typeof device != 'undefined'){
                
            }else
                device={
                    uuid:'emulator'
                };
            
            console.log(event.buzzable)
            if(event.buzzable==1)
                db.hasBuzz(event.id,function(ret){
                    // console.log(ret)
                    $('.button-buzz').show();
                    if(ret==0){
                        
                    }else{
                        $('.button-buzz').addClass('done');
                    }
                });
           else if(event.buzzable==2){
               db.lastRead(event.id,event.lastModified,function(lastTimeRegistered){
                   console.log(lastTimeRegistered+" = "+event.lastModified)
                   if(lastTimeRegistered!=event.lastModified)
                       $('.button-message').show();
                   else
                       $('.button-message-read').show();
               });
                
            }
            
            $('.button-message,.button-message-read').click(function(){
                db.setRead(event.id,event.lastModified);
                options['messages']=event.messaging.split('______')
                app.mvc('message',options);
                
            });
           
            
            $('.button-buzz').click(function(){
                if($(this).hasClass('done'))return;
                $(this).addClass('done');
                api.query("controller=buzz&event_id="+event.id+"&device="+device.uuid, function(){
                   
                    db.buzz(event.id,function(){
                        app.toast("Votre buzz a bien été enregistré!");
                       
                    });
                   
                });
            });
            
            $('.button-facebook').click(function(){
                                        app.open("facebook:"+event.place+" le "+tools.formatDateDayAndStringMonth(event.eventDate));
                });
            if(event.address.length<=10)
                $('.button-googlemap').hide();
            $('.button-googlemap').click(function(){
                app.open("http://maps.apple.com/?q="+encodeURIComponent(event.address),'_blank');
            });
            $('.button-twitter').click(function(){
                app.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(event.place+" le "+tools.formatDateDayAndStringMonth(event.eventDate)),'_blank');
            });
        
        }, function(){
            console.log('error')
            app.mvc('listing',options.options)
        });
        
        
        
    }
};