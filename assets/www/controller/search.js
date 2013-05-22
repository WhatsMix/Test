var SearchController = {
    willAppear: function(options){
        switch(options.category){
            /*case '7'://music
                case '3'://tourisme
                case '11'://restos
                case '9'://prestas
                case '8'://concerts
                case '5'://loisirs
                case '4'://religion
                case '1'://communes*/
            case '18':
            case '1':
                $('#input-genre .title').html('Service');
                break;
            case '11':
                $('#input-genre .title').html('Spécialité');
                break;
            case '4':// religion, commune
                $('#input-city .title').html('Commune');
                $('#input-genre .title').html('Religion');
                break;
            case '5': //activité, ville
                $('#input-genre .title').html('Activité');
                break;
            case '7': //style musical
                $('#input-city ').hide();
                $('#input-genre .title').html('Style Musical');
                $('#input-genre').css({
                    'top':200
                });
                // music
                SearchController.addButtonTop20(options);
                break;
            case '9'://style
                $('#input-genre .title').html('Style');
                $('#input-city ').hide();
                $('#input-genre').css({
                    'top':200
                });
                SearchController.addButtonTop20(options);
                break;
            case '8'://style musical
                $('#input-genre .title').html('Style Musical');
                $('#input-city ').hide();
                $('#input-genre').css({
                    'top':200
                });
                break;
            case '11':
                $('#input-genre .title').html('Genre');
                break;
            case '3':
                $('#input-genre .title').html('Commune');
                $('#input-city ').hide();
                $('#input-genre').css({
                    'top':200
                });
                $('#search').css({
                    'top':380
                });
                break;
        }
    },
    init: function(options) {
        if(!options){
            options = {
                island: 1,
                category: 1
            }
        }
        
        
        $('#page.search .button-back').click(function(){
            app.mvc('categories',options,true);
        });
        console.log(options.category)
        console.log(ListingController.categories[options.category])
        $('#page.search .mtitle').html(ListingController.categories[parseInt(options.category)]);
        $('#page.search #search').click(function(){
                $(this).addClass('selected');
           
            
            $c=$('#page.search #city').val()?encodeURIComponent($('#page.search #city').val()):'';
            $g = $('#page.search #genre').val()?encodeURIComponent($('#page.search #genre').val()):'';
            api.query("controller=event&action=search&city="+$c+"&genre="+$g+"&category="+options.category+"&island="+options.island, function(json){
                if(!json.search.length){
                    app.toast("Votre recherche n\'a retourner aucun résultat");
                }else{
                    console.log('error')
                    options.events = json.search;
                    app.mvc('listing',options);
                }
            });
        });
        
        api.query("controller=event&action=searchDropDown&island="+options.island+"&category="+options.category,function(json){
            $('#city').append($('<option value="">Choisir</option>'));
            for(i in json.cities){
                $('#city').append($('<option>'+json.cities[i]+'</option>'));
            }
            $('#genre').append($('<option value="">Choisir</option>'));
            for(i in json.genre){
                $('#genre').append($('<option>'+json.genre[i]+'</option>'));
            }
        },function(){
             app.toastError();
             app.mvc('categories',options,true);
        });
    },
    addButtonTop20: function(options){
        $('#page.search #input-top20').show();
                
        $('#input-top20').click(function(){
            //if(! $(this).hasClass('selected'))
             $(this).addClass('selected');
         /*else
              $(this).removeClass('selected')*/
             
            api.query("controller=event&action=top&category="+options.category+"&island="+options.island, function(json){
                        
                if(json.top.length){
                    console.log('error')
                    options.events = json.top;
                    options.top = true;
                    app.mvc('listing',options);
                }
                        
            });
        });
    }
};