(function($) {

	var CURRENT_USER;

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

		mixpanel.identify("12148");
    	mixpanel.people.set({
		    "$email": "jsmith@example.com",    // only special properties need the $
		    
		    "$created": "2011-03-16 16:53:54",
		    "$last_login": new Date(),         // properties can be dates...
		    
		    "credits": 150,                    // ...or numbers
		    
		    "gender": "Male",                    // feel free to define your own properties
			
			"$name": "TESTING PERSON"
		});

		// Check if there is a current user
		// if there isn't, create one with a temp one

		CURRENT_USER = Parse.User.current();

		if(CURRENT_USER){
			console.log('This is a currently logged in user: ' + CURRENT_USER.id);
			
			mixpanel.identify(CURRENT_USER.id);
	    	mixpanel.people.set({
			    "$last_login": new Date(),
			});
		} else {
			newUser();
		}

    	initListeners();
    }

    function initListeners(){
    	// Email sign up at Header

    	$('.startSimulationButton').click(function(){
    		var clickSource = $(this).attr('data-source');

    		mixpanel.track('simulation_start', { 'source': clickSource }, function(){
		    	// Tell Facebook this was a lead
		    	fbq('track', 'CompleteRegistration');
		    	window.location.href = 'simulation/index.html';
		    });
		    
    	});

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

    		var bottomUpsell = $('#bottomUpsellListener');
    		if(isScrolledIntoView(bottomUpsell)){
    			if(!check5){
    				trackPageDepth('bottom_upsell');
    				console.log('Bottom upsell section in view');
    				check5 = true;
    			}	
    		}

    	},500);
    }

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

	function newUser(){

        var username = "anon-" + (Math.floor(Math.random() * (1000000000)) + 1);

        var user = new Parse.User();
        user.set("username", username);
        user.set("password", "temppass");
        user.set("isAnonUserAcc", true);

        user.signUp(null, {
          success: function(user) {

          	mixpanel.identify(user.id);

          	var anonUserName = 'anon-' + user.id;

	    	mixpanel.people.set({
			    "$created": new Date(),
			    "$last_login": new Date(),       
			    
				"$name": anonUserName
			});

			console.log('New Parse & mixpanel user');

			// mixpanel.people.set({
			//     "$email": "jsmith@example.com",    // only special properties need the $
			    
			//     "$created": "2011-03-16 16:53:54",
			//     "$last_login": new Date(),         // properties can be dates...
			    
			//     "credits": 150,                    // ...or numbers
			    
			//     "gender": "Male",                    // feel free to define your own properties
				
			// 	"$name": "TESTING PERSON"
			// });
          },
          error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            alert("Error: " + error.code + " " + error.message);
            $('.loadingScreen').css('display','none');
          }
        });
    }

})(jQuery);










