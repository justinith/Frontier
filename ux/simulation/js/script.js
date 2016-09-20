(function() {

    var isFirst = false;
    var PART;
    var LOGGED_IN = false;
    var TOTAL_PAUSES = 0;
    var NEXT_OPTION = "NA";
    var CURRENT_USER;

    window.onload = function(){
        setState();
    	initListeners();
        initVideoListeners();
    }

    function setState(){
        Parse.initialize("dAZG21fjAIntGGj3aCYhCPU0DzyYK3IwOOFKo87K", "K4FaGmO8AEwTGkQjBrm0kfa0awBxc2ROrgpC6RG7");

        // Sets which part this is
        PART = $("body").attr("data-part");

        // Changes flag to TRUE if the page is
        // the first page
        if(PART == '1-intro'){
            isFirst = true;
        }

        CURRENT_USER = Parse.User.current();
        if (CURRENT_USER) {
            LOGGED_IN = true;
            var currentPart = CURRENT_USER.get('currentPart');

            // If this is the intro screen
            if(PART == '1-intro'){
                startRightPart(currentPart);
            } else {
                // if the user is on the 4th part, and the 
                // current part of the user is still the 3rd, 
                // change it to the 4th
                if(PART == '4-lowfi' && currentPart == '3-flow'){
                    CURRENT_USER.set("currentPart", "4-lowfi");
                    CURRENT_USER.save(null, {
                        success: function(user) {
                            console.log('Current part updated');
                        }
                    });

                // if the user is on the 5th part, and the 
                // current part of the user is still the 4rd, 
                // change it to the 5th
                } else if(PART == '5-finale' && currentPart == '4-lowfi'){
                    CURRENT_USER.set("currentPart", "5-finale");
                    CURRENT_USER.save(null, {
                        success: function(user) {
                            console.log('Current part updated');
                        }
                    });
                }
            }

            console.log("The part the user, " + CURRENT_USER.get("name") + " is at is " + CURRENT_USER.get('currentPart'));
        }

        // When page loads, tell MP that is loaded
        mixpanel.track("Part Load", { "part": PART });    
    }

    function initVideoListeners(){
        var video = Wistia.api("core_sim_video");

        video.ready(function(){

            var timeWatched;

            // Auto play the video when the page loads
            // if it is not the first intro scene
            setTimeout(function(){
                video.bind("play", function(){
                    timeWatched = video.time();
                    console.log("Video was played at " + timeWatched);
                    mixpanel.track("video-play", { "part": PART, "time": timeWatched});
                });

                video.play();   
            },500);

            // Auto show the task when the video ends
            video.bind("end", function() {
              $('.videoHolder').animate({
                    width: 800},
                    700,function(){
                        console.log("Video ended and was paused " + TOTAL_PAUSES + " times.");
                        mixpanel.track("video-end", { "part": PART, "total_pauses" : TOTAL_PAUSES });
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

            video.bind("pause",function(){
                timeWatched = video.time();
                console.log("Video was paused at " + timeWatched);
                mixpanel.track("video-pause", { "part": PART, "time": timeWatched});
                TOTAL_PAUSES++;
            });
        });
        
    }

    function initListeners(){

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
            attemptSubmitNewUser();
        });

        $('.finishButton').click(function(){
            if(PART == "3-flow" || PART == "5-finale"){

                // If this is the finale page, track which end option
                // the user selected. Send to MP & save to global var.
                if(PART == "5-finale"){
                    var buttonText = $(this).html();
                    NEXT_OPTION = buttonText;
                    mixpanel.track("next_option", { "option" : buttonText });
                    console.log("The reason was " + NEXT_OPTION);
                }

                if(!LOGGED_IN){
                    $('#upsellModal').modal('show');
                } else if(PART == "3-flow"){
                    window.location.href = 'p4.html';
                } else if(PART == "5-finale"){
                    $('#thankYouModal').modal('show');
                    mixpanel.track("simulation_end", { "state": "Registered user"}); 
                }
            }
        });

        $("#logoutbackdoor").click(function(){
            Parse.User.logOut();
        });
    }

    function attemptSubmitNewUser(){
        var name = $('#recipient-name').val();
        var email = $('#recipient-email').val();
        var phone = $('#recipient-phone').val();

        if(name == "" || email == ""){
            // not complete info
            alert("Need to fill out Name and Email");
        } else {
            if(validateEmail(email)){
                // success

                // upload info, associate it to user
                newUser(name,email,phone);
                
            } else {
                // invalid email
                alert("Please enter valid email.");
            }
        }
    }

    function newUser(name,email,phone){

        var username = name + "-" + email + "-" + (Math.floor(Math.random() * (100000)) + 1);

        var user = new Parse.User();
        user.set("username", username);
        user.set("password", "temppass");
        user.set("email", email);
        user.set("name", name);
        user.set("upsellPart", PART);
        user.set("currentPart", PART);
        user.set("next_option", NEXT_OPTION);

        if(phone != ""){
            user.set("phoneNum", phone);
        }

        $('.loadingScreen').css('display','initial');

        user.signUp(null, {
          success: function(user) {
            mixpanel.track("new_user", { "part": PART, "name": name, "email": email});

            $('.loadingScreen').css('display','none');
            // redirect to next page after uploads completes
            // Upsell at Part III
            if(PART == "3-flow"){
                window.location.href = 'p4.html';
            }
            // Upsell at Finale
            else if(PART == "5-finale"){
                alert("Congrats! You're signed up and done. We'll reach out soon!");
            }

          },
          error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            alert("Error: " + error.code + " " + error.message);
            $('.loadingScreen').css('display','none');
          }
        });
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function startRightPart(currentPart){

        // when clicking "start", you should be at
        // the part that's been completed most
        if(PART == "1-intro"){
            if(currentPart == "3-flow"){
                window.location.href = 'p3.html';
            } else if(currentPart == "4-lowfi"){
                window.location.href = 'p4.html';
            } else if(currentPart == "5-finale"){
                window.location.href = 'p5.html';
            }
        }

        // When navigating to earlier parts, allow them to do so


    }



})();