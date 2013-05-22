var ListingController = {
    i:1,
    options:null,
    init: function(options) {
        if(!options){
            options = {
                category: '2',
                island: 1
            }
        }
        ListingController.options = options;
        ListingController.i=1;
        
        
        $('#page.listing .button-back').click(function(){
            switch(options.category){
                case '7'://music
                case '3'://tourisme
                case '11'://restos
                case '9'://prestas
                case '8'://concerts
                case '18'://santé
                case '5'://loisirs
                case '4'://religion
                case '1'://communes
                    app.mvc('search',{
                        category: options.category,
                        island:options.island
                    },true);
                    break;
                case '13'://contact
                    app.mvc('contact',{
                        category: options.category,
                        island:options.island
                    },true);
                    break;
                case '12'://contact
                    api.query("controller=buzz&action=top&island="+options.island, function(json){
                        app.mvc('listing',{
                            events: json.top,
                            category: options.category,
                            buzzes: true,
                            island:options.island
                        });
                    },true);
                    break;
            }
            app.mvc('categories',{
                island:options.island
            },true)
            return true;
        });
        if(options.events){
            for(i in options.events){
                ListingController.addEvent(options.events[i],options);
            }
            var li = $('<li><div class="date">&nbsp;</div></li>');
            $('#page.listing ul').append(li);
       
           
        }else{
            api.query("category="+options.category+"&island="+options.island, function(events){
                for(i in events){
                    ListingController.addEvent(events[i],options);
                }
                var li = $('<li><div class="date">&nbsp;</div></li>');
                $('#page.listing ul').append(li);
                
            }, function(){
                app.mvc('categories',{
                    island:options.island
                },true)
            });
        }
        
        $('.maintitle').html(ListingController.categories[options.category]);
         
        ListingController.lastDate = null;
        ListingController.first = true;
        
        
        
        if(options.top){
            $('#page.listing ul').addClass('top');
            $('#top').show();
        }
    },
    first: true,
    categories: [null,'communes','actualités','tourisme','cultes religieux','loisirs','spectacles','musique','concerts','presta artistes','soirées','restos','top buzzes','infos / contacts','bon plan','clubs-bars','rumeurs','cinéma','santé'],
    lastDate: null,
    addEvent: function(event,options){// date + text + picture + title
    	
        var li = $('<li id="event-'+event.id+'"><div class="date"></div><div class="row"><div class="picture"><img/></div><div class="right"><div class="title"></div><br/><div class="text"></div></div></div></li>');
       
        var dateText = event.eventDate && event.eventDate!='0000-00-00'?tools.formatDateDayAndStringMonth(event.eventDate):'';
        
        li.find('.date').html(dateText);
        if(options.category=='1'  || dateText== ListingController.lastDate)
            li.find('.date').hide();
        
        if(ListingController.first && options.category!='1'){
           // $('.thedate').html(dateText);
            ListingController.first = false;
        }
        
        li.find('.picture').find('img').attr({
            src:app.fileUrl+"thumb/"+event.urlThumb
        });
        li.find('.title').html(event.place);
        li.find('.text').html(event.shortDescription);
        li.attr('id','event-'+event.id);
        
        if(options.top){
            li.find('.row').append($('<img src="media/img/t'+(ListingController.i++)+'.png" class="star"/>'));
        }
       
        $('#page.listing ul').append(li);
        $('#page.listing ul').append('<div class="separator"></div>');
       
        li.click(function(){
            
            app.mvc('event',{
                id:parseInt($(this).attr('id').replace('event-','')),
                options: options
            });
            
        });
        
        
        ListingController.lastDate = dateText;
    }
};