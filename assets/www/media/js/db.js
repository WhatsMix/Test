var db = {
    da: null,
    init: function(name) {
        // alert('test ok')
        da = window.openDatabase("db", "1.0", name, 1000000);
        //alert('db ok')
        //db.query('DROP TABLE buzzes');
        db.query('CREATE TABLE IF NOT EXISTS buzzes (id unique, eventid,time)');
        db.query('CREATE TABLE IF NOT EXISTS messages (id unique, eventid,time)');
        db.query('CREATE TABLE IF NOT EXISTS configured (id unique)');
        

    /*if (app.DEV) {
           
        }*/
    },
    query: function(sql, success,errorHandler) {
        da.transaction(function(tx) {
            tx.executeSql(sql);
        }, function(error) {
            
            if(errorHandler)
                errorHandler();
            else{
                console.log(sql);
                console.log(error);
            }
        }, success);
    },
    select: function(sql, success) {
        da.transaction(function(tx) {
            tx.executeSql(sql, [], function(tx, results) {
                success(results.rows);
            });
        }, function(error) {
            console.log(sql);
            console.log(error);
        });
    },
    login: function(yes,no) {
        db.select("SELECT * FROM users LIMIT 1", function(set) {
            if(set.length>0){
                app.showCart();
                yes({
                    id: set.item(0).id,
                    token: set.item(0).token
                });
            }else{
                no();
            }
        });
    },
    buzz: function(eventid) {
        console.log("INSERT INTO buzzes(eventid,time) VALUES ("+eventid+"," + new Date().getTime()+ ")");
        db.query("INSERT INTO buzzes(eventid,time) VALUES ("+eventid+"," + new Date().getTime()+ ")",function(){
            console.log('buzz saved ')
        });
    },
    hasBuzz: function(eventId,handler){
        console.log(new Date().getTime()+"SELECT * FROM buzzes WHERE eventid="+eventId+" AND time>="+(new Date().getTime()-60*1000*60*24*7))
        db.select("SELECT * FROM buzzes WHERE eventid="+eventId+" AND time>="+(new Date().getTime()-60*1000*60*24*7), function(set) {
            console.log(set)
            handler(set.length);
        });
    },
    lastRead: function(eventId,eventLastModified,handler){
        db.select("SELECT * FROM messages WHERE eventid="+eventId, function(set) {
            
            if(set.length)
                handler(set.item(0).time);
            else
                handler(0);
        });
    },
    setRead: function(eventId,eventLastModified){
        db.select("SELECT * FROM messages WHERE eventid="+eventId, function(set) {
            if(set.length==0){console.log('not found, insert')
                db.query("INSERT INTO messages(eventid,time) VALUES ("+eventId+","+eventLastModified+")",function(){
                    console.log('set read insert')
                });
            }else{
                console.log(set.item(0))
                db.query("UPDATE messages SET time="+eventLastModified+" WHERE  eventid="+eventId,function(){
                    console.log('set read update')
                });
            }
        });
    },
    firstTime: function(handler){
        db.select("SELECT * FROM configured", function(set) {
            if(set.length==0){
                  
                db.query("INSERT INTO configured(id) VALUES (1)",function(){
                    
                });
                  handler(true);
            }else
                handler(false);
        });
    }
/*emptyCart: function(){
        $('#cart').hide();
        db.query('DELETE FROM cart');
    },*/
};