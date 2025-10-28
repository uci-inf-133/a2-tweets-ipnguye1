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

	// initialize the graphs as a hidden element
	document.getElementById("distanceVisAggregated").style.display = 'none'; 

	var simplifiedTweets = [];
	var activities = {};

	for (var i = 0; i < tweet_array.length; i++) {
		var currentTweet = tweet_array[i];
		var tweetActivity = currentTweet.activityType;

		if (tweetActivity != "unknown") {
			var tweetDistance = currentTweet.distance;
			if (currentTweet.text.includes("km") && 
			(currentTweet.text.indexOf("km") < currentTweet.text.indexOf("-"))) {
				tweetDistance = currentTweet.distance / 1.609;
			}

			var tweetDay = currentTweet.time.getDay();
			tweetDay = convertDay(tweetDay);

			simplifiedTweets[simplifiedTweets.length] = {"activity": tweetActivity, "distance": tweetDistance, "day": tweetDay};
			activities[tweetActivity] = 0;
		}
	}

	for (var i = 0; i < simplifiedTweets.length; i++) {
		activities[simplifiedTweets[i]["activity"]] += 1;
	}

	var tally = [];

	for (var i = 0; i < Object.entries(activities).length; i++) {
		var tallyEntry = {"name": Object.keys(activities)[i], "count": Object.values(activities)[i]};
		tally[i] = tallyEntry;
	}

	function sortFunct(a, b) {
		return a["count"] < b["count"];
	}

	tally.sort(sortFunct)
	console.log(tally);

	var topActivity = tally[0]["name"];
	var secondActivity = tally[1]["name"];
	var thirdActivity = tally[2]["name"];

	function filterActivity(tweet) {
		return (tweet["activity"] === topActivity) || 
			(tweet["activity"] === secondActivity) || 
			(tweet["activity"] === thirdActivity);
	}

	var filteredTweets = simplifiedTweets.filter(filterActivity);
	console.log(filteredTweets);

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

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
		y: {
			field: "name",
			type: "nominal",
			sort: "-x",
		},
		x: {
			field: "count",
			type: "quantitative",
			sort: "ascending",
		}
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	distanceVis_graph = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
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
	  //TODO: Add mark and encoding
	};

	vegaEmbed('#distanceVis', distanceVis_graph, {actions:false});

	aggregatedDistanceVis_graph = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
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
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#distanceVisAggregated', aggregatedDistanceVis_graph, {actions:false});

	document.getElementById("distanceVis").style.display = 'block'; 

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

function switchGraph () {
	if (document.getElementById("distanceVisAggregated").style.display === 'none') {
		document.getElementById("distanceVisAggregated").style.display = 'block';
		document.getElementById("distanceVis").style.display = 'none'; 
		console.log("you can se it now :)");
	} else {
		document.getElementById("distanceVisAggregated").style.display = 'none';
		document.getElementById("distanceVis").style.display = 'block'; 
	}
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	aggregate.addEventListener("click", switchGraph);
	loadSavedRunkeeperTweets().then(parseTweets);
});