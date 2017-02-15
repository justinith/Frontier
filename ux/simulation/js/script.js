(function() {

    var isFirst = false;
    var PART = "";
    var LOGGED_IN = false;
    var TOTAL_PAUSES = 0;
    var NEXT_OPTION = "NA";
    var CURRENT_USER;
    var ISANON = false;

    window.onload = function(){
        setState();
    	initListeners();
        initVideoListeners();
    }

    function setState(){
        
        Parse.initialize("dAZG21fjAIntGGj3aCYhCPU0DzyYK3IwOOFKo87K", "K4FaGmO8AEwTGkQjBrm0kfa0awBxc2ROrgpC6RG7");
        console.log(Parse.Session.isCurrentSessionRevocable());

        // Sets which part this is
        PART = $("body").attr("data-part");

        // Changes flag to TRUE if the page is
        // the first page
        if(PART == '1-intro'){
            isFirst = true;
        }

        CURRENT_USER = Parse.User.current();
        mixpanel.identify(CURRENT_USER.id);

        if (CURRENT_USER) {
            LOGGED_IN = true;

            // if this is a temp user, don't do anything

            ISANON = CURRENT_USER.get('isAnonUserAcc');

            // If the user is an anonymous user
            if(ISANON){
                console.log('This is a anon account');
            // If the user is a registered user
            } else {

                // Get the part the user was last at
                // at their most recent session
                var currentPart = CURRENT_USER.get('currentPart');
                
                currentPart = localStorage.getItem("userPart");

                // currentPart = mixpanel.get_property("$email");
                console.log("User's current part in Parse: " + currentPart);

                // If this is the intro screen
                if(PART == '1-intro'){
                    startRightPart(currentPart);
                
                // If this is not the intro screen
                } else {
                    
                    console.log("The CURRENT part is " + PART);

                    if(PART == '2-personas' && currentPart == '1-intro'){
                        setCurrentPartOfUser('2-personas');
                    } else if(PART == '3-flow' && currentPart == '2-personas'){
                        setCurrentPartOfUser('3-flow');
                    } else if(PART == '4-lowfi' && currentPart == '3-flow'){
                        setCurrentPartOfUser("4-lowfi");
                    } else if(PART == '5-finale' && currentPart == '4-lowfi'){
                        setCurrentPartOfUser("5-finale");
                    } else {
                        console.log("Not setting new part of user");
                    }
                }

                console.log(CURRENT_USER.get("name") + "(the user) is at part: " + localStorage.getItem("userPart"));    
            }

        // If for some reason the user isn't logged into Parse
        } else {
            alert("Error with user login. Error Code: no_logged_temp_user. Please contact team@discoverfrontier.com for fixes. We're sorry for the problem.");
        }

        // When page loads, tell MP that is loaded
        mixpanel.track("Part Load", { "part": PART });    
    }

    function initVideoListeners(){
        var video = Wistia.api("core_sim_video");

        video.ready(function(){
            $('.loadingScreen').css('display','none');
            var timeWatched;

            // Auto play the video when the page loads
            // if it is not the first intro scene
            setTimeout(function(){
                video.bind("play", function(){
                    timeWatched = video.time();
                    console.log("Video was played at " + timeWatched);
                    mixpanel.track("video-play", { "part": PART, "time": timeWatched });
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
                            $('#skipAhead').slideUp();
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

        if(isFirst){
            $('#skipAheadLink').click(function(){
                var video = Wistia.api("core_sim_video");
                video.pause();
                $('#skipAhead').slideUp();
                $('.videoHolder').animate({
                    width: 800},
                    700,function(){
                        console.log("Video ended and was paused " + TOTAL_PAUSES + " times.");
                        $('.vidInstructions').css('display','inherit');
                        $('.revealInitiate').slideDown();
                        
                    }
                );
            });

            $('.finishButton').click(function(){
                if(ISANON){
                    attemptRegisterNewUser();
                } else {
                    // attemptSubmitNewUser();
                }
            });
        }

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
            if(ISANON){
                attemptRegisterNewUser();
            } else {
                // attemptSubmitNewUser();
            }
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
            console.log("Logged out via backdoor");
        });

        $("#logoutButton").click(function(){
            Parse.User.logOut();
            console.log("Logged out via backdoor");
            window.location.href = '../index.html';
        });
    }

    // register a new user with real info
    function attemptRegisterNewUser(){
        var name = $('#recipient-name').val();
        var email = $('#recipient-email').val();
        var phone = $('#recipient-phone').val();
        var pw = $('#recipient-password').val();
        var pwc = $('#recipient-password-confirm').val();

        if(name == "" || email == ""){
            // not complete info
            alert("Need to fill out Name and Email");
        } else {
            if(pw != pwc){
                // mismatched passwords
                alert("Your passwords do not match. Please type the same password.");
            } else if(validateEmail(email) == false){

                // invalid email
                alert("Please enter valid email.");
            } else if(validateEmail(email)){
                
                // success, upload info, associate it to user
                // newUser(name,email,phone);
                registerUser(name,email,phone,pw);
            }
        }
    }

    // Registers the current user with new info
    function registerUser(name,email,phone,pw){

        // Update Parse user data

        CURRENT_USER.set("email", email);
        CURRENT_USER.set("name", name);
        CURRENT_USER.set("password",pw);
        CURRENT_USER.set("upsellPart", PART);
        CURRENT_USER.set("currentPart", PART);
        CURRENT_USER.set("next_option", NEXT_OPTION);
        CURRENT_USER.set("isAnonUserAcc", false);

        if(phone != ""){
            CURRENT_USER.set("phoneNum", phone);
        }

        $('.loadingScreen').css('display','initial');

        CURRENT_USER.save(null, {
          success: function(user) {
            mixpanel.track("new_user", { "part": PART, "name": name, "email": email});

            $('.loadingScreen').css('display','none');
            // redirect to next page after uploads completes
            // Upsell at Part III
            // if(PART == "3-flow"){
            //     window.location.href = 'p4.html';
            // }
            // Upsell at Finale
            // else if(PART == "5-finale"){
            //     alert("Congrats! You're signed up and done. We'll reach out soon!");
            // }

            localStorage.setItem("userPart","1-intro");

            if(isFirst){
                mixpanel.people.set({
                    "$email": email,
                    "$name": name,
                    "currentPart": PART
                },function(){
                    window.location.href = 'p2.html';
                });
            }

          },
          error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            alert("There was an error in creating the new user: " + error.code + " " + error.message);
            $('.loadingScreen').css('display','none');
          }
        });
    }

    function setCurrentPartOfUser(part){

        // mixpanel.people.set({
        //     "currentPart": part
        // },function(){
        //     console.log('Current part updated in Parse & MP');
        // });

        localStorage.setItem("userPart",part);

        // console.log("Trying to set user's part to " + part);
        // console.log(CURRENT_USER);


        // CURRENT_USER.set("currentPart", part);
        // CURRENT_USER.save(null, {
        //     success: function(returnedUser) {
        //         mixpanel.people.set({
        //             "currentPart": part
        //         },function(){
        //             console.log('Current part updated in Parse & MP');
        //         });
        //         console.log("Changed the current user part");
        //     },
        //     error: function(returnedUser, error) {
                
        //         alert('Did not set new part of user: ' + error.message + " // error code: " + error.code);
        //     }
        // });
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
            } else if(currentPart == "2-personas"){
                window.location.href = 'p2.html';
            } else {
                console.log("current part error");
            }
        } else {
            console.log("No reidrect, Not the first part");
        }

        // When navigating to earlier parts, allow them to do so


    }



})();