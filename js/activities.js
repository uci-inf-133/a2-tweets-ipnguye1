function convertDay (tweetDay) {
	switch (tweetDay) {
		case 0:
			tweetDay = "Sunday";
			break;
		case 1:
			tweetDay = "Monday";
			break;
		case 2:
			tweetDay = "Tuesday";
			break;
		case 3:
			tweetDay = "Wednesday";
			break;
		case 4:
			tweetDay = "Thursday";
			break;
		case 5:
			tweetDay = "Friday";
			break;
		case 6:
			tweetDay = "Saturday";
	}
	return tweetDay;
}

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// initialize distanceVisAggregated as a hidden element
	document.getElementById("distanceVisAggregated").style.display = 'none'; 

	// initialize variables
	var simplifiedTweets = [];
	var activities = {}; // associates activities with how mnay tweets mentions them

	// simplify tweets down to activity, distance, and day
	for (var i = 0; i < tweet_array.length; i++) {
		var currentTweet = tweet_array[i];
		var tweetActivity = currentTweet.activityType;

		if (tweetActivity != "unknown") {
			var tweetDistance = currentTweet.distance;

			// convert km to mi
			if (currentTweet.text.includes("km")) {
				if (currentTweet.text.indexOf("-") != -1) { // if tweet has custom text
					// checks to see if first instance of km is NOT part of the custom text
					// (it can be in the custom text but it should not be only in the text)
					if (currentTweet.text.indexOf("km") < currentTweet.text.indexOf("-")) {
						tweetDistance = currentTweet.distance / 1.609;
					}
				} else { // tweet has no custom text
					tweetDistance = currentTweet.distance / 1.609;
				}
			}

			// since day is stored as a number, convertDay() turns it into the actual day
			var tweetDay = currentTweet.time.getDay();
			tweetDay = convertDay(tweetDay);

			simplifiedTweets.push({"activity": tweetActivity, "distance": tweetDistance, "day": tweetDay});
			
			// adds activity to activities if activity isn't in it, increments entry by 1 if it is
			if (activities[tweetActivity]) {
				activities[tweetActivity] += 1;
			} else {
				activities[tweetActivity] = 1;
			}
		}
	}

	// turns activities into an array of objects for vega graphs to work
	var tally = [];
	for (var i = 0; i < Object.entries(activities).length; i++) {
		var tallyEntry = {"name": Object.keys(activities)[i], "count": Object.values(activities)[i]};
		tally.push(tallyEntry);
	}

	// sorts tally to get the 3 most popular activities
	function sortFunct(a, b) {
		return a["count"] < b["count"];
	}
	tally.sort(sortFunct);

	var topActivity = tally[0]["name"];
	var secondActivity = tally[1]["name"];
	var thirdActivity = tally[2]["name"];

	function filterActivity(tweet) {
		return (tweet["activity"] === topActivity) || 
			(tweet["activity"] === secondActivity) || 
			(tweet["activity"] === thirdActivity);
	}
	var filteredTweets = simplifiedTweets.filter(filterActivity);

	// makes tweet count graph
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tally
	  },
	  "mark": "bar",
	"transform": [
		{
		"window": [{
			"op": "rank",
			"as": "rank"
		}],
		"sort": [{ "field": "count", "order": "descending" }]
		}, {
		"filter": "datum.rank <= 3"
		}
	],
	  "encoding": {
		x: {
			field: "name",
			type: "nominal",
			sort: "-y",
		},
		y: {
			field: "count",
			type: "quantitative",
			sort: "ascending",
		}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	// makes distance graph
	distanceVis_graph = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph displaying the distances users have logged throughout the week.",
	  "data": {
	    "values": filteredTweets
	  },
	  "mark": "point",
	  "encoding": {
		y: {
			field: "distance",
			type: "quantitative",
		},
		x: {
			field: "day",
			type: "nominal",
			sort: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		},
		color: {
			field: "activity",
			type: "nominal"
		}
	  }
	};

	vegaEmbed('#distanceVis', distanceVis_graph, {actions:false});

	// makes averaged distance graph
	aggregatedDistanceVis_graph = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph displaying the average of logged user distances throughout the week.",
	  "data": {
	    "values": filteredTweets
	  },
	  "mark": "point",
	  "encoding": {
		y: {
			aggregate: "mean",
			field: "distance",
			type: "quantitative",
		},
		x: {
			field: "day",
			type: "nominal",
			sort: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		},
		color: {
			field: "activity",
			type: "nominal"
		}
	  }
	};
	vegaEmbed('#distanceVisAggregated', aggregatedDistanceVis_graph, {actions:false});

	// if I don't have this line, the graph will be displayed right above the button which bothers me
	document.getElementById("distanceVis").style.display = 'block'; 

	// change the text elements to the appropiate labels
	document.getElementById("numberActivities").innerText = tally.length; 
	document.getElementById("firstMost").innerText = topActivity; 
	document.getElementById("secondMost").innerText = secondActivity; 
	document.getElementById("thirdMost").innerText = thirdActivity; 

	document.getElementById("longestActivityType").innerText = "bike"; 
	document.getElementById("shortestActivityType").innerText = "walk"; 

	document.getElementById("weekdayOrWeekendLonger").innerText = "the weekend"; 
}

// switches the graph and button text depending on which graph is being shown
function switchGraph () {
	if (document.getElementById("distanceVisAggregated").style.display === 'none') {
		document.getElementById("distanceVisAggregated").style.display = 'block';
		document.getElementById("distanceVis").style.display = 'none'; 
		document.getElementById("aggregate").innerText = 'Show all activities';
	} else {
		document.getElementById("distanceVisAggregated").style.display = 'none';
		document.getElementById("distanceVis").style.display = 'block';
		document.getElementById("aggregate").innerText = 'Show means'; 
	}
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	aggregate.addEventListener("click", switchGraph);
	loadSavedRunkeeperTweets().then(parseTweets);
});