var ContactController = {
    
    init: function(options) {
        if(!options)
            options ={
                island: 1,
                category: 1
            }
        
        $('#page.contact #call').attr('href','tel:'+app.infos['i'+options.island].telephone);
        $('#page.contact #call2').attr('href','tel:'+app.infos['i'+options.island].telephone2);
        $('#page.contact #email').attr('href','mailto:'+app.infos['i'+options.island].email);
        $('#page.contact #facebook').attr('href',app.infos['i'+options.island].facebook);
        $('#page.contact #twitter').attr('href',app.infos['i'+options.island].twitter);
        
        $('#page.contact .button-call').html(app.infos['i'+options.island].telephone);
        $('#page.contact .button-call2').html(app.infos['i'+options.island].telephone2);
        $('#page.contact .button-email').html(app.infos['i'+options.island].email);
        $('#page.contact .button-facebook').html(app.infos['i'+options.island].facebookText);
        $('#page.contact .button-twitter').html(app.infos['i'+options.island].twitterText);
        
        $('#page.contact .button-info').click(function(){
            app.mvc('terms',options,true);
        });
        
        $('#page.contact .button-back2').click(function(){
            app.mvc('categories',options,true);
        });
    
    
       
    }
};