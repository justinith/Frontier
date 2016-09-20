(function($) {

	skel.breakpoints({
		wide: '(max-width: 1680px)',
		normal: '(max-width: 1280px)',
		narrow: '(max-width: 1000px)',
		mobile: '(max-width: 736px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				$body.removeClass('is-loading');
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// CSS polyfills (IE<9).
			if (skel.vars.IEVersion < 9)
				$(':last-child').addClass('last-child');

		// Scrolly links.
			$('.scrolly').scrolly();

		// Prioritize "important" elements on narrow.
			skel.on('+narrow -narrow', function() {
				$.prioritize(
					'.important\\28 narrow\\29',
					skel.breakpoint('narrow').active
				);
			});

	});

	Parse.initialize("dAZG21fjAIntGGj3aCYhCPU0DzyYK3IwOOFKo87K", "K4FaGmO8AEwTGkQjBrm0kfa0awBxc2ROrgpC6RG7");
	
	toastr.options = {
	  "closeButton": false,
	  "debug": false,
	  "newestOnTop": false,
	  "progressBar": false,
	  "positionClass": "toast-top-center",
	  "preventDuplicates": false,
	  "onclick": null,
	  "showDuration": "300",
	  "hideDuration": "1000",
	  "timeOut": "5000",
	  "extendedTimeOut": "1000",
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut"
	}

	var check1 = false;
	var check2 = false;
	var check3 = false;
	var check4 = false;
	var check5 = false;
	var check6 = false;
	var check7 = false;
	var check8 = false;
	var check9 = false;

	window.onload = function(){
		mixpanel.track("Page Loaded");
    	initListeners();
    }

    function initListeners(){
    	// Email sign up at Header

    	// $('.emailCTASection .submit').click(function(){
    	// 	var newEmail = $('.emailCTASection input').val();
    	// 	if(validateEmail(newEmail)){
    	// 		uploadEmail(newEmail,'header');
    	// 		mixpanel.track("New Email", {
			  //       "email": newEmail,
			  //       "status": "success",
			  //       "source": 'header'
			  //   });
    	// 	} else {
    	// 		mixpanel.track("New Email", {
			  //       "email": newEmail,
			  //       "status": "failure",
			  //       "source": 'header'
			  //   });
    	// 		alert('Oops, please enter valid email address');
    	// 	}
    	// });

    	// $('.proEmailAdd input').click(function(){
    	// 	mixpanel.track("Email Box Click", {
		   //      "source": 'lip'
		   //  });
    	// });

    	$('.startSimulationButton').click(function(){
    		var clickSource = $(this).attr('data-source');

    		mixpanel.track('simulation_start', { 'source': 'foo' }, function(){
		    	fbq('track', 'CompleteRegistration');
		    	window.location.href = 'simulation/index.html';
		    });

    		// Tell Facebook this was a lead
		    
    	});



    	// $('.proEmailAdd .submitButton').click(function(){
    	// 	var newEmail = $('.proEmailAdd input').val();
    	// 	if(validateEmail(newEmail)){
    	// 		uploadEmail(newEmail,'lip');
    	// 		mixpanel.track("New Email", {
			  //       "email": newEmail,
			  //       "status": "success",
			  //       "source": 'lip'
			  //   });
    	// 	} else {
    	// 		alert('Oops, please enter valid email address');
    	// 		mixpanel.track("New Email", {
			  //       "email": newEmail,
			  //       "status": "failure",
			  //       "source": 'lip'
			  //   });
    	// 	}
    	// });


    	setInterval(function(){

    		// Did the user reach the definition part?

    		var definition = $('#defListener');
    		if(isScrolledIntoView(definition)){
    			if(!check1){
    				trackPageDepth('definition');
    				console.log('Definition in view');
    				check1 = true;
    			}
    		}

    		// Did the user reach the immersion part?

    		var immersionListener = $('#immersionListener');
    		if(isScrolledIntoView(immersionListener)){
    			if(!check2){
    				trackPageDepth('immersion');
    				console.log('Immersion section in view');
    				check2 = true;
    			}	
    		}

    		// Did the user reach the interaction part?

    		var interactionListener = $('#interactionListener');
    		if(isScrolledIntoView(interactionListener)){
    			if(!check3){
    				trackPageDepth('interaction');
    				console.log('Interaction section in view');
    				check3 = true;
    			}	
    		}

    		// Did the user reach the additional features part?

    		var addFeaturesListener = $('#addFeaturesListener');
    		if(isScrolledIntoView(addFeaturesListener)){
    			if(!check4){
    				trackPageDepth('add_features');
    				console.log('Additional features section in view');
    				check4 = true;
    			}	
    		}

    		// Did the user reach the professional list part?

    		var proListListener = $('#proListListener');
    		if(isScrolledIntoView(proListListener)){
    			if(!check5){
    				trackPageDepth('pro_list');
    				console.log('Professions list section in view');
    				check5 = true;
    			}	
    		}

    	},500);
    }

 //    function validateEmail(email) {
	//     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	//     return re.test(email);
	// }

	// function uploadEmail(email,source){
	// 	fbq('track', 'Lead');
	// 	var BetaEmail = Parse.Object.extend("BetaEmail");
	// 	var betaEmail = new BetaEmail();

	// 	betaEmail.set("email", email);
	// 	betaEmail.set("source", source);

	// 	betaEmail.save(null, {
	// 	  success: function(betaEmail) {

	// 	    // Execute any logic that should take place after the object is saved.
	// 	    toastr.success('Email Submitted', 'Look out for our Beta release!')
	// 	    // alert('New object created with objectId: ' + betaEmail.id);
	// 	  },
	// 	  error: function(gameScore, error) {
	// 	    // Execute any logic that should take place if the save fails.
	// 	    // error is a Parse.Error with an error code and message.
	// 	    alert('Failed to create new object, with error code: ' + error.message);
	// 	  }
	// 	});
	// }

	function isScrolledIntoView(elem) {
	    var docViewTop = $(window).scrollTop();
	    var docViewBottom = docViewTop + $(window).height();

	    var elemTop = $(elem).offset().top;
	    var elemBottom = elemTop + $(elem).height();

	    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	}

	function trackPageDepth(section){
		mixpanel.track("Page Depth", {
			        "level": section
			    });
	}

})(jQuery);










