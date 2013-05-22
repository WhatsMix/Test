var TermsController = {
    init: function() {
        $('#page.terms .button-back').click(function(){
            app.mvc('home',{},true)
        });
    }
};