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

	return writtenTweets;
}

function addRow(rows) {
	var tableBody = document.getElementById('tweetTable');
	while (tableBody.hasChildNodes()) {
		tableBody.removeChild(tableBody.firstChild);
	}
	var newHTML = "";
	var newHTMLNodeList = [];
	for (var i = 0; i < rows.length; i++) {
		newHTMLNodeList[i] = document.createElement("tr");
		newHTMLNodeList[i].innerHTML = rows[i];
	}
	// console.log(newHTML);
	var newHTMLNode = document.createElement("tr");
	newHTMLNode.innerHTML = newHTML;
	

	for (var i = 0; i < newHTMLNodeList.length; i++) {
		tableBody.appendChild(newHTMLNodeList[i]);
	}
}

function getTerms(savedTweetPromise) {
	var searchTerms = textFilter.value;
	createRow(searchTerms, savedTweetPromise).then(addRow);
}

async function createRow(searchTerms, savedTweetPromise) {

	if (!searchTerms) {
		searchTerms = "";
	}

	var matchingTweets = []
	var matchingTweetIndex = 0;

	let writtenTweets = await savedTweetPromise;

	for (var i = 0; i < writtenTweets.length; i++) {
		var tempTweet = new Tweet(writtenTweets[i].text, writtenTweets[i].created_at);
		var lowercaseText = tempTweet.writtenText.toLowerCase();
		if (searchTerms && lowercaseText.includes(searchTerms.toLowerCase())) {
			matchingTweets[matchingTweetIndex] = tempTweet;
			matchingTweetIndex += 1;
		}
	}

	var returnArray = [];

	for (var i = 0; i < matchingTweets.length; i++) {
		returnArray[i] = matchingTweets[i].getHTMLTableRow(i);
	}

	return returnArray;
}

function addEventHandlerForSearch(savedTweetPromise) {
	textFilter.addEventListener('keyup', function() {
		getTerms(savedTweetPromise)
	});
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	var savedTweetPromise = loadSavedRunkeeperTweets().then(parseTweets);
	addEventHandlerForSearch(savedTweetPromise);
});