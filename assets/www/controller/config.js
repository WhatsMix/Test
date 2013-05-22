String.prototype.replaceAt=function(index, character) {
      return this.substr(0, index) + character + this.substr(index+character.length);
   }

var ConfigController= {
    init: function(options){
        $('#page.config .button-back').click(function(){
            app.mvc('home',options,true);
        });
        
        
           
        if(window.localStorage.islands[1]!='0')
            $('.button-island1').addClass('checked');
        if(window.localStorage.islands[2]!='0')
            $('.button-island2').addClass('checked');
        if(window.localStorage.islands[3]!='0')
            $('.button-island3').addClass('checked');
        if(window.localStorage.islands[4]!='0')
            $('.button-island4').addClass('checked');
                
            
       
        
        $('.button-island1,.button-island2,.button-island3,.button-island4').click(function(){
            var checked = $(this).hasClass('checked');
            var b = $(this);
                     
           	 	window.localStorage.islands = window.localStorage.islands.replaceAt(parseInt($(this).attr('id')),checked?'0':$(this).attr('id'));                                                          
	            if(!checked)
	                b.addClass('checked')
	            else
	                b.removeClass('checked')     
	                
	               window.open('island://island:'+b.attr('id')+(checked?'0':'1'),'_blank','location=yes');
            });

        }
    }