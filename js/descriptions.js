function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	var writtenTweets = runkeeper_tweets.filter(isWritten);
	function isWritten(tweet){
		var tempTweet = new Tweet(tweet.text, tweet.created_at);
		return tempTweet.written;
	};

	// initialize searchText to '' and searchCount to 0 upon loading
	document.getElementById('searchText').innerText = textFilter.value;
	document.getElementById('searchCount').innerText = 0;

	return writtenTweets;
}

function getMatchingTweets(tweetList) {
	var searchTerms = textFilter.value;
	var matchingTweets = [];
	// if (searchTerms) prevents an empty search bar from returning every single tweet
	if (searchTerms) { 
		for (var i = 0; i < tweetList.length; i++) { // grabs tweets with matching text
			var tempTweet = new Tweet(tweetList[i].text, tweetList[i].created_at);
			var lowercaseText = tweetList[i].text.toLowerCase();
			if (lowercaseText.includes(searchTerms.toLowerCase())) {
				matchingTweets.push(tempTweet);
			}
		}
	}
	return matchingTweets;
}

function addRow(rows) {
	// get tweetTable and empty it
	var tableBody = document.getElementById('tweetTable');
	while (tableBody.hasChildNodes()) {
		tableBody.removeChild(tableBody.firstChild);
	}

	// create a list of table rows to add later
	var newHTMLNodeList = [];
	for (var i = 0; i < rows.length; i++) {
		newHTMLNodeList.push(document.createElement("tr"));
		newHTMLNodeList[i].innerHTML = rows[i];
	}

	// add the created table rows to tweetTable
	for (var i = 0; i < newHTMLNodeList.length; i++) {
		tableBody.appendChild(newHTMLNodeList[i]);
	}

	// update searchCount
	document.getElementById('searchCount').innerText = newHTMLNodeList.length;

}

async function createRow(searchTerms, savedTweetPromise) {
	// initialize variables
	var matchingTweets = [];
	var returnArray = [];
	let writtenTweets = await savedTweetPromise;

	// set searchText to what was in the search bar
	document.getElementById('searchText').innerText = searchTerms;

	// if (searchTerms) prevents an empty search bar from returning every single tweet
	if (searchTerms) { 
		for (var i = 0; i < writtenTweets.length; i++) { // grabs tweets with matching written text
			var tempTweet = new Tweet(writtenTweets[i].text, writtenTweets[i].created_at);
			var lowercaseText = tempTweet.writtenText.toLowerCase();

			if (lowercaseText.includes(searchTerms.toLowerCase())) {
				matchingTweets.push(tempTweet);
			}
		}
	}

	// creates and returns an array of matching tweets' HTML table rows
	for (var i = 0; i < matchingTweets.length; i++) {
		returnArray.push(matchingTweets[i].getHTMLTableRow(i));
	}
	return returnArray;
}

function updateTable(savedTweetPromise) {
	// grab the search terms from textFilter
	var searchTerms = textFilter.value;
	// create table rows using Tweet's getHTMLTableRow() then add them to the table
	createRow(searchTerms, savedTweetPromise).then(addRow);
}

function addEventHandlerForSearch(savedTweetPromise) {
	// the event listener will run updateTable() every time textFilter is updated
	// also updateTable needs access to the written tweets to work so it's passed in
	textFilter.addEventListener('keyup', function() {
		updateTable(savedTweetPromise)
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	// parseTweets grabs only written tweets; the result is then passed into addEventHandlerForSearch
	var savedTweetPromise = loadSavedRunkeeperTweets().then(parseTweets);
	addEventHandlerForSearch(savedTweetPromise);
});