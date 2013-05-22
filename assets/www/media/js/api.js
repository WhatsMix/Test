var api = {
    token: null,
    init: function() {
        
    },
    query: function(path,okHandler,errorHandler) {
        app.loading(true);
        //alert(app.apiUrl+path+"&token="+api.token);
        $.ajax({
            type: 'GET',
            url: app.apiUrl+path+"&token="+api.token,
            async: false,
            jsonpCallback: 'jsonp',
            contentType: "application/json",
            dataType: 'jsonp',
            success: function(json) {
                console.log(app.apiUrl+path+' success')
                app.loading(false);
                if(okHandler){
                    okHandler(json);
                }
            },
            complete: function(){
                app.loading(false);
            },
            error: function(e) {
                if(e.status == 200){// it is actually working ...
                    app.loading(false);
                }else{
                    console.log(e)
                    app.loading(false);
                    app.toastError();
                    if(errorHandler){
                        errorHandler(e);
                    }
                }
            }
        });
    },
    querySite: function(path,okHandler,errorHandler) {
        //app.loading(true);
        console.log(app.siteUrl+path+"&token="+api.token);
        $.ajax({
            type: 'GET',
            url: app.siteUrl+path+"&token="+api.token,
            async: false,
            jsonpCallback: 'jsonp',
            contentType: "application/json",
            dataType: 'jsonp',
            success: function(json) {
                //app.loading(false);
                if(okHandler){
                    okHandler(json);
                }
            },
            complete: function(){
                //app.loading(false);
            },
            error: function(e) {
               // app.loading(false);
                app.toastError();
                if(errorHandler){
                    errorHandler(e);
                }
            }
        });
    },
    post: function(path,thedata,okHandler,errorHandler) {
        app.loading(true);
        console.log(app.apiUrl+path+"&token="+api.token);
        $.ajax({
            data: thedata,
            type: 'GET',
            url: app.apiUrl+path+"&token="+api.token,
            async: false,
            jsonpCallback: 'jsonp',
            contentType: "application/json",
            dataType: 'jsonp',
            success: function(json) {
                app.loading(false);
                if(okHandler){
                    okHandler(json);
                }
            },
            error: function(e) {
                app.loading(false);
                app.toastError();
                if(errorHandler){
                    errorHandler(e);
                }
            }
        });
    }
}