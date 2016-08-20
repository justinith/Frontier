(function() {

    var isFirst = false;

    window.onload = function(){

        if($('.completionText').html() == '0% completed'){
            isFirst = true;
        }

    	initListeners();
        initVideoListeners();
    }

    function initVideoListeners(){
        var video = Wistia.api("core_sim_video");

        video.ready(function(){

            // Auto play the video when the page loads
            // if it is not the first intro scene
            setTimeout(function(){
                video.play();    
            },500);


            // Auto show the task when the video ends
            video.bind("end", function() {
              $('.videoHolder').animate({
                    width: 800},
                    700,function(){
                        if(isFirst){
                            $('.vidInstructions').css('display','inherit');
                            $('.revealInitiate').slideDown();
                        } else {
                            $('.vidInstructions').css('display','inherit');
                            $('.taskWork').slideDown();
                        }
                    }
                );
            });
        });
        
    }

    function initListeners(){

    	$("#cresults").click(function(){
    		$("#cresults").addClass("active");
    		$("#presults").removeClass("active");
    		$("#fedTile").css("display","block");	
    		$("#uxTile").css("display","none");
    		$("#archTile").css("display","none");
    		$(".notification").css("display","none");
    	});

    	$("#presults").click(function(){
    		$("#presults").addClass("active");
    		$("#cresults").removeClass("active");
    		$("#fedTile").css("display","none");	
    		$("#uxTile").css("display","block");
    		$("#archTile").css("display","block");
    	});

        $('.startButton').click(function(){
           $('.openingScreen').slideUp(800); 
           $('#header').slideDown(1300,function(){
            $('video')[0].play(); 
           });
           $('.coreContent').slideDown(1800);
           $('footer').slideDown(1600);
        });

        $('.revealButton').click(function(){
            $('.revealInitiate').slideUp();
            $('.taskWork').slideDown();
        });

        $('#submit-button').click(function(){

            var name = $('#recipient-name').val();
            var email = $('#recipient-email').val();
            var phone = $('#recipient-phone').val();

            var part = $('#submit-button').attr('data-part');

            if(name == "" || email == ""){
                // not complete info
                alert("Need to fill out Name and Email");
            } else {
                if(validateEmail(email)){
                    // success
                    alert("Okay, good name and good email");

                    // Upsell at Part III
                    if(part == "3"){
                        window.location.href = 'p4.html';
                    }
                    // Upsell at Finale
                    else if(part == "5"){
                        alert("");
                    }

                    // upload info, associate it to user
                    
                    // redirect to next page after uploads completes
                    
                } else {
                    // invalid email
                    alert("Please enter valid email.");
                }
            }
        });

        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }



})();