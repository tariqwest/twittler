      $(document).ready(function(){
        //var $body = $('body');
        //$body.html('');

        index = streams.home.length -1;

        streams.home.offset = 0;

        // Continually run to fetch any new tweets
        (function(){

          generateMyTimeline();

          setTimeout(arguments.callee, 500);
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

        // Display tweets for a home or user timeline
        function displayTweets (stream, timeline){
          for(var i=0; i < stream.length; i++){
            var tweet = stream[i];
            var $tweet = $('<div class="tweet"></div>');

            $tweet.html('@<a class="user-link" href="#' + tweet.user + '">'+ tweet.user + '</a>: ' + tweet.message + ' | ' + tweet.created_at);
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
            var timeout = setTimeout(arguments.callee, 500);
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

        $('body').on('click', '.user-link', function(){
          var user = $(this).text();
          $('#user-timeline').toggle();
          $('#my-timeline').toggle();
          generateUserTimeline(user);
        });

        $('#back').on('click', function(){
          $('#user-timeline').toggle();
          $('#user-timeline').find('.tweet').remove();
          $('#my-timeline').toggle();
        });

      });