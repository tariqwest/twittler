
      $(document).ready(function(){

        streams.home.offset = 0;

        // Continually run to fetch any new tweets
        (function(){
          generateMyTimeline();
          setTimeout(arguments.callee, 1000);
        })();

        // Continually run to update dates (shown in 'from now' format)
        (function(){
          $('.tweet').each(function(){   
            var date = $(this).data('date');
            date = moment(date).fromNow(true);
            $(this).find('.tweet-date').text(date);
          });
          setTimeout(arguments.callee, 10000);
        })();


        // Generate my home timeline
        function generateMyTimeline(){
          var workingOffset = function(){ 
            var saveOffset = streams.home.offset;
            return (function(){ return saveOffset; })();
          };
          var stream = streams.home.slice(workingOffset());
          displayTweets(stream, 'my-timeline');
        }
        
        // Generate timeline for a selected user
        function generateUserTimeline(user){
          var stream = streams.users[user];
          streams.users[user]['offset'] = 0;
          displayTweets(stream, 'user-timeline');
          updateUserTweets(user, 'user-timeline');
        }

        // Filter timeline by user
        function filterTimeline(user){

          $('.tweet').addClass('hide');

          $('.tweet').filter('[data-user="' + user + '"]').removeClass('hide');
        }

        // Display tweets for a home or user timeline
        function displayTweets (stream, timeline){
          for(var i=0; i < stream.length; i++){
            var tweet = stream[i];
            var $tweet = $('<div class="tweet" data-user="'+tweet.user+'" data-date="'+tweet.created_at+'"></div>');

            var date = moment(tweet.created_at, "ddd mmm dd yyyy HH:MM:ss").fromNow(true);

            $tweet.html('<div class="tweet-top"><a class="user-link" href="#' + tweet.user + '"><div class="tweet-user">' + tweet.user + '<span>@'+ tweet.user + '</span></div></a><div class="tweet-date">' + date + '</div></div><div class="tweet-message">' + tweet.message + '</div>');
            $tweet.prependTo('#'+timeline).hide().fadeIn( 400 );
            
            if(timeline === 'my-timeline'){
              streams.home.offset += 1;
            }else{
              streams.users[tweet.user]['offset'] += 1;
            }
          }
        }

        // Fetch new tweets for a selected user
        function updateUserTweets(user, timeline){
          (function(){
            var timeout = setTimeout(arguments.callee, 1000);
            $('#back').on('click', function(){
              clearTimeout(timeout);
            });
            var workingOffset = function(){ 
              var saveOffset = streams.users[user]['offset'];
              return (function(){ return saveOffset; })();
            };
            var stream = streams.users[user].slice(workingOffset());
            displayTweets(stream, timeline);
            timeout;
          })();
        }

        /*
        // Show queued new tweets if button is clicked
        $('body').on('click', '.show-new-tweets', function(){
          var timeline = $(this).closest().attr('id');
          if( timeline === '#user-timeline'){
            //updateUserTimeline(user);
          }else{
            generateMyTimeline();
          }       
        });
        */

        // Show tweets for a user if user's link is clicked
        $('body').on('click', '.tweet-user', function(){
          var user = $(this).closest('.tweet').data('user');
          $('#user-timeline-sidebar').prepend('<h1>Welcome to ' + user + ' timeline!</h1>');
          $('#user-timeline-sidebar').show();
          $('#user-timeline').show();
          $('#my-timeline').hide();
          $('#my-timeline-sidebar').hide();
          generateUserTimeline(user);
        });

        // Return to view of home
        $('#back').on('click', function(){
          $('#user-timeline').hide();
          $('#user-timeline').find('.tweet').remove();
          $('#user-timeline-sidebar').hide();
          $('#user-timeline-sidebar').find('h1').remove();
          $('#my-timeline').show();
          $('#my-timeline-sidebar').show();
        });

        // Return to view of home
        $('#submit').on('click', function(){
          var message = $('#enter-tweet').val();
          writeTweet(message);
          $('#enter-tweet').val('');
        });

      });