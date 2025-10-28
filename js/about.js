function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	// initialize variables
	var oldestTweet = tweet_array[0].time;
	var newestTweet = tweet_array[0].time;
	var howManyCompletedEvents = 0;
	var howManyLiveEvents = 0;
	var howManyAchievements = 0;
	var howManyMiscEvents = 0;

	var writtenCompleteEvents = 0;

	// process array
	for (var i = 0; i < tweet_array.length; i++) {
		// if there is a tweet older than the current oldest tweet, set that as the oldest
		if (tweet_array[i].time < oldestTweet) {
			oldestTweet = tweet_array[i].time;
		}

		// if there is a tweet newer than the current newest tweet, set that as the newest
		if (tweet_array[i].time > newestTweet) {
			newestTweet = tweet_array[i].time;
		}

		// count how many tweets there are for each category
		if (tweet_array[i].source == "completed_event") {
			howManyCompletedEvents += 1;
			if (tweet_array[i].written) { // count how many written completed event tweets there are
				writtenCompleteEvents += 1;
			}
		} else if (tweet_array[i].source == "live_event") {
			howManyLiveEvents += 1;
		} else if (tweet_array[i].source == "achievement") {
			howManyAchievements += 1;
		} else {
			howManyMiscEvents += 1;
		}
	}

	// set dates
	var dateOptions = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		};
	document.getElementById('firstDate').textContent = oldestTweet.toLocaleDateString("en-US", dateOptions);
	document.getElementById('lastDate').textContent = newestTweet.toLocaleDateString("en-US", dateOptions);

	// set both "completedEvents" class elements to number of completed elements
	var completedEventsArray = document.getElementsByClassName('completedEvents');
	completedEventsArray[0].textContent = howManyCompletedEvents;
	completedEventsArray[1].textContent = howManyCompletedEvents;
	// calculate the percentage of how many event tweets there were
	var completedEventsPctArray = document.getElementsByClassName('completedEventsPct');
	var completedEventPercentage = (howManyCompletedEvents / tweet_array.length) * 100;
	completedEventsPctArray[0].textContent = math.format(completedEventPercentage, {notation: 'fixed', precision: 2}) + "%";

	// set the liveEvent element to live event count
	var liveEventsArray = document.getElementsByClassName('liveEvents');
	liveEventsArray[0].textContent = howManyLiveEvents;
	// calculate the percentage of how many live tweets there were
	var liveEventsPctArray = document.getElementsByClassName('liveEventsPct');
	var liveEventPercentage = (howManyLiveEvents / tweet_array.length) * 100;
	liveEventsPctArray[0].textContent = math.format(liveEventPercentage, {notation: 'fixed', precision: 2}) + "%";

	// set the achievements element to achievement event count
	var achievementsArray = document.getElementsByClassName('achievements');
	achievementsArray[0].textContent = howManyAchievements;
	// calculate the percentage of how many achievement tweets there were
	var achieveEventsPctArray = document.getElementsByClassName('achievementsPct');
	var achieveEventPercentage = (howManyAchievements / tweet_array.length) * 100;
	achieveEventsPctArray[0].textContent = math.format(achieveEventPercentage, {notation: 'fixed', precision: 2}) + "%";

	// set the miscellaneous element to miscellaneous event count
	var miscArray = document.getElementsByClassName('miscellaneous');
	miscArray[0].textContent = howManyMiscEvents;
	// calculate the percentage of how many miscellaneous tweets there were
	var miscEventsPctArray = document.getElementsByClassName('miscellaneousPct');
	var miscEventPercentage = (howManyMiscEvents / tweet_array.length) * 100;
	miscEventsPctArray[0].textContent = math.format(miscEventPercentage, {notation: 'fixed', precision: 2}) + "%";


	// set the "written" class elements to number of written complete event tweets
	var writtenArray = document.getElementsByClassName('written');
	writtenArray[0].textContent = writtenCompleteEvents;
	// calculate proportion of written complete tweets
	var writtenPctArray = document.getElementsByClassName('writtenPct');
	var writtenPercentage = (writtenCompleteEvents / howManyCompletedEvents) * 100;
	writtenPctArray[0].textContent = math.format(writtenPercentage, {notation: 'fixed', precision: 2}) + "%";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});