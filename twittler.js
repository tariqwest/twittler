
      $(document).ready(function(){

        streams.home.offset = 0;

        // Continually run to fetch any new tweets for my home timeline
        (function fetchMyTimelineTweets(){
          generateMyTimeline();
          setTimeout(fetchMyTimelineTweets, 1000);
        })();

        // Continually run to update dates in 'from now' format
        (function updateDates(){
          $('.tweet').each(function(){   
            var date = $(this).data('date');
            date = moment(date).fromNow(true);
            $(this).find('.tweet-date').text(date);
          });
          setTimeout(updateDates, 10000);
        })();

        // Generate my home timeline
        function generateMyTimeline(){
          var stream = streams.home.slice(streams.home.offset);
          displayTweets(stream, 'my-timeline');
        }
        
        // Generate timeline for a selected user
        function generateUserTimeline(user){
          var stream = streams.users[user];
          streams.users[user]['offset'] = 0;
          displayTweets(stream, 'user-timeline');
          updateUserTweets(user, 'user-timeline');
        }

        // Continually fetch new tweets for a selected user
        function updateUserTweets(user, timeline){
          (function fetchUserTimelineTweets(){
            var timeout = setTimeout(fetchUserTimelineTweets, 1000);
            // Stop fetching when this user timeline is not shown
            $('#back').on('click', function(){
              clearTimeout(timeout);
            });
            var stream = streams.users[user].slice(streams.users[user]['offset']);
            displayTweets(stream, timeline);
            timeout;
          })();
        }

        // Display tweets for my home timeline or a user timeline
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

        // Return to view of my home timeline
        $('#back').on('click', function(){
          $('#user-timeline').hide();
          $('#user-timeline').find('.tweet').remove();
          $('#user-timeline-sidebar').hide();
          $('#user-timeline-sidebar').find('h1').remove();
          $('#my-timeline').show();
          $('#my-timeline-sidebar').show();
        });

        // Create a new tweet
        $('#submit').on('click', function(){
          var message = $('#enter-tweet').val();
          writeTweet(message);
          $('#enter-tweet').val('');
        });

      });