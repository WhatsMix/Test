var MessageController = {
    init: function(options) {
        
        $('#page.message .button-back').click(function(){
            app.mvc('event',options,true);
        });
        
        for(i in options.messages)
            $('#page.message .content').append($('<p>'+options.messages[i]+'</p><div class="separator"></div>'));
        
        
        
    }
};