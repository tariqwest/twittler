
      $(document).ready(function(){

        // Keep track of how many tweets we've already displayed
        streams.home.offset = 0;

        // Display tweets on first page load
        displayTweets();

        // Continually run to update count of new, not displayed, tweets
        (function updateTweetCount(){
          if(streams.home.offset > 0){
            var newTweetsCount = 0;
            if(location.hash && location.hash.substr(1) !== 'timeline'){
              var user = location.hash.substr(1);
              newTweetsCount = streams.users[user].length - 
                $('.tweet').filter('[data-user="' + user + '"]').length;
            }else{
              newTweetsCount = streams.home.length - streams.home.offset;
            }
            if(newTweetsCount > 0){
              $('#newtweets-count').text(newTweetsCount);
              $('#timeline-newtweets').slideDown(300);
            }
          }
          setTimeout(updateTweetCount, 5000);
        })();

        // Continually run to update dates in 'from now' format
        (function updateTweetDates(){
          $('.tweet').each(function(){   
            var date = $(this).data('date');
            date = moment(date).fromNow(true);
            $(this).find('.tweet-date').text(date);
          });
          setTimeout(updateTweetDates, 10000);
        })();

        // Display tweets, and filter by user in hash if present
        function displayTweets (){
          for(var i=streams.home.offset; i < streams.home.length; i++){
            var tweet = streams.home[i];
            var $tweet = $('<div class="tweet" data-user="' + tweet.user +
             '" data-date="'+ tweet.created_at + '"></div>');
            var friendlyDate = moment(tweet.created_at, "ddd mmm dd yyyy HH:MM:ss").fromNow(true);
            
            $tweet.html('<div class="tweet-top"><a class="user-link" href="#' + 
              tweet.user + '"><div class="tweet-user">' + tweet.user + '<span>@'+ 
              tweet.user + '</span></div></a><div class="tweet-date">' + friendlyDate + 
              '</div></div><div class="tweet-message">' + tweet.message + '</div>');
            $tweet.insertAfter('#timeline-newtweets');
            streams.home.offset += 1;
          }
          if(location.hash){
            filterTweetsByUser(location.hash.substr(1));
          }
        }
        
        // Filter timeline to show tweets for a selected user
        function filterTweetsByUser(user){
          if(user === 'timeline'){
            $('.tweet').show();
          }else{
            $('.tweet').hide();
            $('.tweet').filter('[data-user="' + user + '"]').show();
            if(user === visitor){
              $('#sidebar-content h1').text('Welcome to your personal timeline, ' + user + '!')
            }else{
              $('#sidebar-content h1').text('Welcome to ' + user + ' timeline!');
              $('#create-tweet').hide();
            }
            $('#back-to-home').show();
          }
        }

        // Show next set of tweets
        $('#timeline-newtweets').on('click', function(){
          $('#timeline-newtweets').slideUp(300);
          displayTweets();
        })

        // Filter tweets for a user if user's link is clicked
        $('body').on('click', '.tweet-user', function(){
          var user = $(this).closest('.tweet').data('user');
          $('#timeline-newtweets').hide();
          //$('#sidebar-content h1').text('Welcome to ' + user + ' timeline!');
          //$('#create-tweet').hide();
          //$('#back').show();
          filterTweetsByUser(user);
        });

        // Return to view of my home timeline
        $('#back-to-home').on('click', function(){
          $('#timeline-newtweets').hide();
          $('#sidebar-content h1').text('Welcome to your home timeline!');
          $('#create-tweet').show();
          $('#back-to-home').hide();
          $('.tweet').show();
          location.hash = 'timeline';
          displayTweets();
        });

        // Create a new tweet
        $('#submit-tweet').on('click', function(){
          var message = $('#enter-tweet').val();
          writeTweet(message);
          $('#enter-tweet').val('');
          $('#timeline-newtweets').hide();
          displayTweets();
        });

      });