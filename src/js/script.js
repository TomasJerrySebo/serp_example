 console.log('run');

(function($){

    window.TourRadar = {

      	init: function () {
            this.loadTours();
      	},
      	loadTours: function() {
      		request = $.ajax({
                url: "src/js/tours.json",
                type: 'GET',
                timeout: 15000
            });
            request.done(function (response, textStatus, jqXHR){
                  console.log(response);
            });
            request.fail(function (jqXHR, textStatus, errorThrown){
                  console.error(
                    'The following error occured: '+
                    textStatus, errorThrown
                  );
            }); 
      	}

  	} // end DiagramartProfile class
       

	 $(function () {
	    TourRadar.init();
	  });

})(jQuery);
