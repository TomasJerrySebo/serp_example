 console.log('run');

(function($){

    window.TourRadar = {

      	init: function () {
            this.loadTours();
            this.appendEvents();
      	},
      	loadTours: function() {
      		request = $.ajax({
                url: "https://raw.githubusercontent.com/TomasJerrySebo/serp_example/master/src/js/tours.json",
                type: 'GET',
                timeout: 15000
            });
            request.done(function (response, textStatus, jqXHR){
            	  var result = JSON.parse(response)
                  console.log(result);
            });
            request.fail(function (jqXHR, textStatus, errorThrown){
                  console.error(
                    'The following error occured: '+
                    textStatus, errorThrown
                  );
            }); 
      	},
        appendEvents: function() { 
          // appending Sort by: to select
          ($(window).width() < 992) ? $('select option').each(function(){ $(this).prepend('Sort by: '); }) : '';
          $(window).resize(function(){ 
            ($(window).width() < 992) ? $('select option').each(function(){ ($(this).text().indexOf('Sort by: ') < 0) ? $(this).prepend('Sort by: ') : ''; }) : $('select option').each(function(){ var text = $(this).text().replace('Sort by: ', ''); $(this).text(text); });
          });

          var minVal = 0;
          var maxVal = 100;
          $( function() {
            $( "#slider-range" ).slider({
              range: true,
              min: minVal,
              max: maxVal,
              values: [ minVal, maxVal ],
              slide: function( event, ui ) {
                 $( "#amount-min" ).html(ui.values[ 0 ]+"days");
                 $( "#amount-max" ).html(ui.values[ 1 ]+"days");
              }
            });
            $( "#amount-min" ).html($( "#slider-range" ).slider( "values", 0 ) +"days");
            $( "#amount-max" ).html($( "#slider-range" ).slider( "values", 1 ) +"days");
          } );


          $( function() {
            $( "#datepicker" ).datepicker();
          } );
        }

  	} // end DiagramartProfile class
       

	 $(function () {
	    TourRadar.init();
	  });

})(jQuery);
