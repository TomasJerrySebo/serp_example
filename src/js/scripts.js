(function($){
    var tourData = '';
    var tourDataInitial = '';
    window.TourRadar = {

      	init: function () {
            this.getTours();
            this.appendEvents();

      	},
      	getTours: function() {
          $.support.cors = true;
      		request = $.ajax({
                url: "https://raw.githubusercontent.com/TomasJerrySebo/serp_example/master/src/js/tours.json",
                crossDomain: true,
                type: 'GET',
                dataType: "json",
                timeout: 15000
            });
            request.done(function (response, textStatus, jqXHR){
                tourData = response;
                tourDataInitial = response;
                TourRadar.setDayFilters('true');


            });
            request.fail(function (jqXHR, textStatus, errorThrown){
                  console.error(
                    'The following error occured: '+
                    textStatus, errorThrown
                  );
            }); 
      	},

        filterDate: function(date,type) {
                  var hitDate = new Date(date);
                  var filteredData = tourData.filter(function (a) {
                            var tour = a.dates;
                            var resultProductData = tour.filter(function (b) {
                            var date = new Date(b.start) || {};
                            var dates = [];
                            if(type == 'date') {
                            return date.getFullYear() == hitDate.getFullYear() && date.getMonth() == hitDate.getMonth() && date.getDate() == hitDate.getDate();
                            }
                            else {
                            return date.getFullYear() == hitDate.getFullYear() && date.getMonth() == hitDate.getMonth();
                            }
                            });
                            if(resultProductData.length > 0) return resultProductData;
                  });
                 if(type !== 'special') {
                      tourData = filteredData;
                      TourRadar.setDayFilters('reload');

                 }
                 return filteredData;

        },
         filterLength: function(start,end) {

                     var filteredData = tourData.filter(function (a) {
                            var tourLength = a.length;
                            return tourLength >= start && tourLength <= end;
                     });
                    tourData = filteredData;
                    TourRadar.setDateFilters('reload');
                    return filteredData;

        },

        sortBy: function(type,init) {
                    switch(type){
                    case 'length-ascending': 
                              tourData.sort(function(a, b) {
                                  return a.length - b.length;
                              });  
                              break; 
                      case 'length-descending':   
                                tourData.sort(function(a, b) {
                                  return b.length - a.length;
                              });  
                              break; 
                      case 'price-ascending':
                              $.each(tourData, function(i, tour) {
                                     tour['dates'].sort(function(a, b) {
                                       return a.eur - b.eur;
                                    });
                                });

                                tourData.sort(function(c, d) {
                                    return  c.dates[0]['eur'] - d.dates[0]['eur'];
                                }); 
                                break; 
                 
                      case 'price-descending':   
                              $.each(tourData, function(i, tour) {
                                     tour['dates'].sort(function(a, b) {
                                       return b.eur - a.eur;
                                    });
                                });

                                tourData.sort(function(c, d) {
                                    return  d.dates[0]['eur'] - c.dates[0]['eur'];
                                });  
                                break;  
                      case 'title-ascending': 
                                tourData.sort(function(a, b) {
                                   return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
                                })
                                break; 
                      case 'title-descending': 
                               tourData.sort(function(a, b) {
                                   return b.name.toUpperCase().localeCompare(a.name.toUpperCase());
                                })
                                break; 
                      case 'date-ascending':  
                              $.each(tourData, function(i, tour) {
                                     tour['dates'].sort(function(a, b) {
                                       return new Date(a.start).getTime() - new Date(b.start).getTime();
                                    });
                                });
                                tourData.sort(function(c, d) {
                                    return new Date(c.dates[0]['start']).getTime() - new Date(d.dates[0]['start']).getTime();
                                });  
                                break; 
                      case 'date-descending':  
                              $.each(tourData, function(i, tour) {
                                     tour['dates'].sort(function(a, b) {
                                       return new Date(b.start).getTime() - new Date(a.start).getTime();
                                    });
                                });
                                tourData.sort(function(c, d) {
                                    return new Date(d.dates[0]['start']).getTime() - new Date(c.dates[0]['start']).getTime();
                                });  
                                break; 
                   
                    };
                    if(init != 'true') { TourRadar.reloadTours(); }
        },

        sortByName: function(data,start,end) {

                     var filteredData = data.filter(function (a) {
                            var tourLength = a.length;
                            return tourLength >= start && tourLength <= end;
                     });

                    return filteredData;


        },

        setDayFilters: function(init) {
                      
                      var tourLength = [];

                      $.each(tourData, function(i, tour) {
                          var length = tour['length'];
                          tourLength.push(length);
                      });

                      var minDays = Math.min.apply(null,tourLength);
                      var maxDays = Math.max.apply(null,tourLength);

                      $( function() {
                        $( "#slider-range" ).slider({
                          range: true,
                          min: minDays,
                          max: maxDays,
                          values: [ minDays, maxDays ],
                          slide: function( event, ui ) {
                             $( "#amount-min" ).html(ui.values[ 0 ]+" days");
                             $( "#amount-max" ).html(ui.values[ 1 ]+" days");
                          }

                        });
                        $( "#amount-min" ).html($( "#slider-range" ).slider( "values", 0 ) +" days");
                        $( "#amount-max" ).html($( "#slider-range" ).slider( "values", 1 ) +" days");
                      } );

                       var startPos = $("#slider-range").slider("value");
                       var endPos = '';

                        $("#slider-range").on("slidestop", function(event, ui) {
                            endPos = ui.value;
                            if (startPos != endPos) {
                               TourRadar.filterLength(ui.values[0],ui.values[ 1 ]);
                            }
                            startPos = endPos;
                        });
                        if(init == 'true') { TourRadar.setDateFilters('true'); }
                        if(init == 'reload') { TourRadar.reloadTours(); }

        },
        setDateFilters: function(init) {
                      var tourDates = [];
                      $.each(tourData, function(i, tour) {
                          $.each(tour['dates'], function(i, dates) {
                            var date = dates['start'];
                            tourDates.push(new Date(date));
                          });

                      });

                      var now = new Date();
                      var maxDate=new Date(Math.max.apply(null,tourDates));
                      var monthDiff = Math.ceil((maxDate.getTime() - now.getTime())/(3600000*24*30));                      
                                    
                      var currentMonth = now.getMonth();
                      var currentYear = now.getFullYear();
                      var month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                      var dateArray = [];
                      

                      for(var i = 0; i < monthDiff; i++){
                          if(currentMonth == 12){
                              currentMonth = 0;
                              now.setFullYear(parseInt(currentYear) + 1);
                              currentYear = now.getFullYear();
                          }
                            function get2D( num ) {
                              return ( num.toString().length < 2 ? "0"+num : num ).toString();
                          }
                          var actualMonth = get2D(currentMonth+1);
                          var dateCount = TourRadar.filterDate(currentYear+'-'+actualMonth,'special');
                          dateArray.push({
                            date:   month[currentMonth]+" "+currentYear,
                            dateNum: currentYear+'-'+actualMonth,
                            ammount: dateCount.length,
                          });
                          currentMonth++;
                      }
                      $('#filter-by-date ul').html('');
                     $.each(dateArray, function(i, filterDates) {
                        if(i == 0) {$('#filter-by-date ul').append('<li class="active" data-date="'+filterDates["dateNum"]+'">'+filterDates["date"]+'<span>('+filterDates["ammount"]+')</span></li>'); }
                        else {$('#filter-by-date ul').append('<li data-date="'+filterDates["dateNum"]+'">'+filterDates["date"]+'<span>('+filterDates["ammount"]+')</span></li>'); }                        
                     })

                      // Show filters
                      $('.filter-loader').fadeOut(function(){
                        $('.filter-box, #clear-all-filters').slideDown();
                      });
                       if(init == 'true') { TourRadar.reloadTours('true'); }
                       if(init == 'reload') { TourRadar.reloadTours(); }

    
        },
        reloadTours: function(init) {

          if(init == 'true') { TourRadar.sortBy('title-ascending','true'); }

          var wrapper = $('#trip-container');
          var hitDate =  $('#filter-by-date .active').data('date')
          var dateLength =hitDate.length;
          hitDate = new Date(hitDate);


          
/*
          dataObj.price = '';
          dataObj.discount = '';
          dataObj.firstDate = '';
          dataObj.firstSeats = '';
          dataObj.secondDate = '';
          dataObj.secondSeats = '';
*/

          //stuff.push( {'name':$(this).attr('checked')} );


          wrapper.slideUp(function(){
                        $('.tour-loader').show();
                        wrapper.html('');
                                                    

                         $.each(tourData, function(i, tour) {
                            var dataObj = {};
                            dataObj.rating = tour['rating'];
                            dataObj.reviews = tour['reviews'];
                            dataObj.tourTitle = tour['name'];
                            dataObj.desc = tour['description'];
                            dataObj.tourLength = tour['length'];
                            dataObj.cityStart = tour['cities'][0]['name'];
                            dataObj.cityEnd = tour['cities'][tour['cities'].length-1]['name'];
                            dataObj.operator = tour['operator_name'];
                            dataObj.destinations = tour['cities'].length;
                            dataObj.url = tour['url'];

                            var limitCounter = 0;
                            dataObj.detail = [];
                            $.each(tour['dates'], function(i, tourInfo) { 
                                      
                                      var date = new Date(tourInfo['start']);
                                      if(dateLength <= 7) {
                                        if(date.getFullYear() == hitDate.getFullYear() && date.getMonth() == hitDate.getMonth() && limitCounter < 2) {
                                            dataObj.detail.push({'price':tourInfo["eur"],'date':tourInfo["start"],'available':tourInfo["availability"], 'discount':(typeof tourInfo["discount"] != "undefined") ? tourInfo["discount"] : ''});
                                            limitCounter++;
                                          }

                                      }
                                      else {
                                          if(date.getFullYear() == hitDate.getFullYear() && date.getMonth() == hitDate.getMonth() && date.getDate() == hitDate.getDate() && limitCounter < 2) {
                                            dataObj.detail.push({'price':tourInfo["eur"],'date':tourInfo["start"], 'available':tourInfo["availability"],'discount':(typeof tourInfo["discount"] != "undefined") ? tourInfo["discount"] : ''});
                                            limitCounter++
                                          }
                                      }
                //                          console.log(date['start']);
                            });
                          var rating = '<img src="src/img/full_star.png"/><img src="src/img/full_star.png"/><img src="src/img/full_star.png"/><img src="src/img/full_star.png"/><img src="src/img/full_star.png"/>';

                              switch(dataObj.rating) {
                                case 4: rating = '<img src="src/img/full_star.png"/><img src="src/img/full_star.png"/><img src="src/img/full_star.png"/><img src="src/img/full_star.png"/>'; break;
                                case 4.5: rating = '<img src="src/img/full_star.png"/><img src="src/img/full_star.png"/><img src="src/img/full_star.png"/><img src="src/img/full_star.png"/><img src="src/img/half_star.png"/>';  break;
                                case 5: rating = '<img src="src/img/full_star.png"/><img src="src/img/full_star.png"/><img src="src/img/full_star.png"/><img src="src/img/full_star.png"/><img src="src/img/full_star.png"/>'; break;
                              }
                              var availableClass = '';
                              var availableClassTwo = '';
                          if(dataObj.detail.length == 1) {
                              if(dataObj.detail[0].available < 3) availableClass = 'alert';

                            var dis_one = dataObj.detail[0].discount;
                            var discount = (dis_one.length == 0) ? '' : '<span class="discount">-'+dis_one+'</span>';
                            var discountClass = (dis_one.length == 0) ? '' : 'discount-corner';
                            wrapper.append('<content class="trip"><div class="box"><div class="product-img '+discountClass+'">'+discount+'<span class="rating">'+rating+'</span><span class="reviews">'+dataObj.reviews+' reviews</span><img src="src/img/bg.jpg" class="main"><img src="src/img/HEART.png" class="wishlist"></div></div><div class="box"><h1>'+dataObj.tourTitle+'</h1><p>"'+dataObj.desc+'"</p><table class="table table-condensed no-border"><tr><td>DAYS</td><td><span class="trip-duration">'+dataObj.tourLength+'</span> days</td></tr><tr><td>DESTINATIONS</td><td><span class="trip-destinations">'+dataObj.destinations+'</span> cities</td></tr><tr><td>STARTS/ENDS</td><td><span class="trip-start">'+dataObj.cityStart+'</span>/<span class="trip-end">'+dataObj.cityEnd+'</span></td></tr><tr><td>OPERATOR</td><td><span class="trip-operator">'+dataObj.operator+'</span></td></tr></table></div><div class="box text-right"><h4>Total price</h4><h3 id="tourPrice">$'+dataObj.detail[0].price+'</h3><img src="src/img/rocket.png" ><table class="table table-condensed no-border" id="tour-date-select"><tr data-price="'+dataObj.detail[0].price+'"><td>'+dataObj.detail[0].date+'</td><td class="'+availableClass+'">'+dataObj.detail[0].available+' seasts left</td></tr></table><a type="button" href="'+dataObj.url+'" class="form-control">View More</a></div></content>');
                          }
                          else {
                             if(dataObj.detail[0].available < 3) availableClass = 'alert';
                              if(dataObj.detail[1].available < 3) availableClassTwo = 'alert';

                              var dis_one = dataObj.detail[0].discount;
                              var dis_two = dataObj.detail[1].discount;
                              var discount = (dis_one.length == 0 && dis_two.length == 0) ? '' : (dis_one.length > 0) ? '<span class="discount">-'+dis_one+'</span>' : '<span class="discount">-'+dis_two+'</span>';
                              var discountClass = (dis_one.length == 0 && dis_two.length == 0) ? '' : 'discount-corner';
                              wrapper.append('<content class="trip"><div class="box"><div class="product-img '+discountClass+'">'+discount+'<span class="rating">'+rating+'</span><span class="reviews">'+dataObj.reviews+' reviews</span><img src="src/img/bg.jpg" class="main"><img src="src/img/HEART.png" class="wishlist"></div></div><div class="box"><h1>'+dataObj.tourTitle+'</h1><p>"'+dataObj.desc+'"</p><table class="table table-condensed no-border"><tr><td>DAYS</td><td><span class="trip-duration">'+dataObj.tourLength+'</span> days</td></tr><tr><td>DESTINATIONS</td><td><span class="trip-destinations">'+dataObj.destinations+'</span> cities</td></tr><tr><td>STARTS/ENDS</td><td><span class="trip-start">'+dataObj.cityStart+'</span>/<span class="trip-end">'+dataObj.cityEnd+'</span></td></tr><tr><td>OPERATOR</td><td><span class="trip-operator">'+dataObj.operator+'</span></td></tr></table></div><div class="box text-right"><h4>Total price</h4><h3 id="tourPrice">$'+dataObj.detail[0].price+'</h3><img src="src/img/rocket.png" ><table class="table table-condensed no-border" id="tour-date-select"><tr data-price="'+dataObj.detail[0].price+'"><td>'+dataObj.detail[0].date+'</td><td class="'+availableClass+'">'+dataObj.detail[0].available+' seasts left</td></tr><tr data-price="'+dataObj.detail[1].price+'"><td>'+dataObj.detail[1].date+'</td><td class="'+availableClassTwo+'">'+dataObj.detail[1].available+' seasts left</td></tr></table><a type="button" href="'+dataObj.url+'" class="form-control">View More</a></div></content>');
                          }
                          }); 
                          $('#trip-container content p').each(function(){ 
                             var name = $(this).text();
                              if (name.length > 110) {
                                  name = name.substr(0,110)+'...';
                              }
                             $(this).text(name);
                           });
                          $('.tour-loader').fadeOut(function(){
                                    wrapper.fadeIn('slow');
                          });         
          });         
 
        },

        appendEvents: function() { 
          // appending Sort by: to select
          ($(window).width() < 992) ? $('select option').each(function(){ $(this).prepend('Sort by: '); }) : '';
          $(window).resize(function(){ 
            ($(window).width() < 992) ? $('select option').each(function(){ ($(this).text().indexOf('Sort by: ') < 0) ? $(this).prepend('Sort by: ') : ''; }) : $('select option').each(function(){ var text = $(this).text().replace('Sort by: ', ''); $(this).text(text); });
          });

          $( function() {
            $( "#datepicker" ).datepicker({ 
              dateFormat: 'yy-mm-dd',
              onSelect: function(dateText) {
                var date = this.value;
                $('#filter-by-date ul li').removeClass('active');
                $(this).addClass('active').data('date',date);
                console.log(TourRadar.filterDate(date,'date'));
              } }).val();
          } );

          $(document).on('click', '#filter-by-date ul li', function(e){
            $('#datepicker').val('').removeClass('active');
            $(this).addClass('active').siblings().removeClass('active');
            var date = $(this).data('date');
            console.log(TourRadar.filterDate(date,'partial'));
          });

           $(document).on('click', '#clear-all-filters', function(e){
            tourData = tourDataInitial;
            $('.filter-loader').fadeOut(function(){
                        $('.filter-box, #clear-all-filters').slideDown();
                      });
            $('.filter-box').fadeOut(function(){
                         $('.filter-loader').show();
                                     TourRadar.setDayFilters('true');

              });
          });

          $(document).on('change', '#sort-by select', function(e){
                           TourRadar.sortBy($(this).val());

          });
          $(document).on('click', '#tour-date-select tr', function(e){
                  var price = $(this).data('price');
                  console.log($(this).parent().parent().siblings('#tourPrice').html('$'+price));

                           //TourRadar.sortBy($(this).val());

          });

             


          
        }

  	} // end TourRadar class
       

	 $(function () {
	    TourRadar.init();
	  });

})(jQuery);
