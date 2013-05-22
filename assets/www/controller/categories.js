var CategoriesController = {
    screen:1,
    defaultMouseX: 0,
    dragging: false,
    transitioning: false,
    animating:false,
    
    init: function(options) {
        $('.button-cat1,.text-cat1,.button-cat2,.text-cat2,.button-cat3,.text-cat3,.button-cat4,.text-cat4,.button-cat5,.text-cat5,.button-cat6,.text-cat6,.button-cat7,.text-cat7,.button-cat8,.text-cat8,.button-cat9,.text-cat9').show();
        $('.button-cat10,.text-cat10,.button-cat11,.text-cat11,.button-cat12,.text-cat12,.button-cat13,.text-cat13,.button-cat14,.text-cat14,.button-cat15,.text-cat15,.button-cat16,.text-cat16').show();
        
        $('#page.categories .button-back').click(function(){
            
            app.mvc('home',{},true);
        });
        
        $('.buttons-categories .button').click(function(){
            
            //if(CategoriesController.dragging || CategoriesController.transitioning)return false;
            $(this).addClass('selected');
            
            var catid = $(this).attr('class').replace('button button-cat','').replace('selected','').replace(' ','');
            //console.log('Cat='+catid+".")
            switch(catid){
                case '7'://music
                case '3'://tourisme
                case '11'://restos
                case '9'://prestas
                case '8'://concerts
                case '5'://loisirs
                case '4'://religion
                case '18'://communes
                case '1'://communes
                    app.mvc('search',{
                        category: catid,
                        island:options.island
                    });
                    break;
                case '13'://contact
                    app.mvc('contact',{
                        category: catid,
                        island:options.island
                    });
                    break;
                case '12'://contact
                    api.query("controller=buzz&action=top&island="+options.island, function(json){
                        app.mvc('listing',{
                            events: json.top,
                            category: catid,
                            buzzes: true,
                            island:options.island
                        });
                    });
                    break;
                
                default:
                    app.mvc('listing',{
                        category: catid,
                        island:options.island
                    });
            }
            
           
        });
        
        CategoriesController.dragging = false;
        CategoriesController.transitioning=false;
        
        $('.iosSlider').iosSlider({
            desktopClickDrag: true,
            snapToChildren: true,
            navSlideSelector: '.sliderContainer .slideSelectors .item',
            /*onSlideComplete: slideComplete,*/
            onSliderLoaded: function(){
                $('.slide2').show();
                $('.slide').show();
                $('.indicators .indicator-1').addClass('selected');
            },
            onSlideChange: function(a){
                if(a.currentSlideNumber == 2){
                 //   $('.button-next').hide();
                 //   $('.button-previous').show();
                  $('.indicators .indicator').removeClass('selected');
                  $('.indicators .indicator-2').addClass('selected');
                }else{
                //    $('.button-next').show();
                 //   $('.button-previous').hide();
                  $('.indicators .indicator').removeClass('selected');
                  $('.indicators .indicator-1').addClass('selected');
                }
            },
           
            scrollbar: true,
            scrollbarContainer: '.sliderContainer .scrollbarContainer',
            scrollbarMargin: '0',
            scrollbarBorderRadius: '0'
        });
        
        
        
        
        
        
       /* $('.button-next').click(function(){
            $('.iosSlider').iosSlider('goToSlide', 2);
        });
         
        $('.button-previous').click(function(){
            $('.iosSlider').iosSlider('goToSlide', 1);
        });*/
    }
};