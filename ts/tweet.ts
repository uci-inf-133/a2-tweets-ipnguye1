class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        } else if (this.text.startsWith("Watch")) {
            return "live_event";
        } else if (this.text.startsWith("Achieved") || this.text.startsWith("I just set")) {
            return "achievement";
        } else {
            return "miscellaneous";
        }
    }

    //returns whether the text includes any content written by the person tweeting
    get written():boolean {
        return this.text.includes("-");
    }

    // returns the tweet's written text
    get writtenText():string {
        if(!this.written) {
            return "";
        }
        // written text begins right after the -
        var beginningOfWrittenText = this.text.indexOf("-") + 1; 
        return this.text.substring(beginningOfWrittenText);
    }

    // returns what the user did
    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        if (this.text.startsWith("Just posted an activity in")) { //edge case (unspecified activity)
            return "unknown";
        }

        var tweetTextArray = this.text.split(" ");
        if (this.written) { // get rid of any written text
            tweetTextArray = tweetTextArray.slice(0, tweetTextArray.indexOf("-"));
        }

        if (tweetTextArray.includes("mi")) { // "mi" usually has the activity right after it
            var returnStringBeginning = tweetTextArray.indexOf("mi") + 1;
            if (tweetTextArray.includes("workout")) {
                var returnStringEnd = tweetTextArray.indexOf("workout");
            } else {
                var returnStringEnd = tweetTextArray.indexOf("with");
            }

            if (returnStringEnd === -1) { // if neither "workout" or "with" exist
                returnStringEnd = tweetTextArray.length;
            }

            var returnStr = tweetTextArray.slice(returnStringBeginning, returnStringEnd).join(" ");
            if (returnStr === "activity") {
                return "unknown";
            } else {
                return returnStr;
            }

        } else if (tweetTextArray.includes("km")) { // "km" usually has the activity right after it
            var returnStringBeginning = tweetTextArray.indexOf("km") + 1;
            if (tweetTextArray.includes("workout")) {
                var returnStringEnd = tweetTextArray.indexOf("workout");
            } else {
                var returnStringEnd = tweetTextArray.indexOf("with");
            }

            if (returnStringEnd === -1) { // if neither "workout" or "with" exist
                returnStringEnd = tweetTextArray.length;
            }

            var returnStr = tweetTextArray.slice(returnStringBeginning, returnStringEnd).join(" ");
            if (returnStr === "activity") {
                return "unknown";
            } else {
                return returnStr;
            }

        } else if (tweetTextArray.includes("workout")) { // "workout" has the activity before it
            return tweetTextArray[tweetTextArray.indexOf("workout") - 1];

        } else if (tweetTextArray.includes("practice")) {
            return tweetTextArray[tweetTextArray.indexOf("practice") - 1];

        } else if (tweetTextArray.includes("session")) {
            return tweetTextArray[tweetTextArray.indexOf("session") - 1];
        } else { // return the string in between "a" and "in" (assumption...)
            var returnStringBeginning = tweetTextArray.indexOf("a") + 1;
            var returnStringEnd = tweetTextArray.indexOf("in");

            if (returnStringEnd === -1) { // if "in" doesn't exist, get the end of array
                returnStringEnd = tweetTextArray.length;
            }

            return tweetTextArray.slice(returnStringBeginning, returnStringEnd).join(" ");
        }
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        // split tweet along the spaces
        var tweetTextArray = this.text.split(" ");

        // Completed events always begin with "Just posted a (insert number) (mi/km)" 
        // so we can assume that the 4th word is the distance unit and the 3rd word is distance
        if (tweetTextArray[4] === "mi" || tweetTextArray[4] === "km") { 
            return Number.parseFloat(tweetTextArray[3]);
        } else { // activities measured in time do not have mi or km
            return 0;
        }
    }

    getHTMLTableRow(rowNumber:number):string {
        // split tweet along the spaces
        var tweetTextArray = this.text.split(" ");

        // look for link location
        var linkIndex = -1;
        for (var i = 0; i < tweetTextArray.length; i++) {
            // adds the link into the tweet
            if (tweetTextArray[i].includes("https://t.co/")) {
                linkIndex = i;
                var link = "<a href=\"" + tweetTextArray[linkIndex] + "\">"; // add beginning <a> tag
                link += tweetTextArray[linkIndex]; // add URL for clickable text
                link += "</a>"; //add </a> tag
                tweetTextArray[i] = link; // insert clickable link into link location
            }
        }

        // put the tweet back together
        var tweetText = tweetTextArray.join(" ");

        // tweet text with the clickable link
        var returnStr = "<td>" + (rowNumber + 1) + "</td><td>" + this.activityType + "</td><td>" + tweetText + "</td>";
        return returnStr;
    }
}