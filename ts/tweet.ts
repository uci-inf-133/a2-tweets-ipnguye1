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
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    // ?????????????????? ok idfk if this really is correct lmfao
    get written():boolean {
        return this.text.includes("-");
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        var beginningOfText = this.text.indexOf("-") + 1;

        //TODO: parse the written text from the tweet
        return this.text.substring(beginningOfText);
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        if (this.text.startsWith("Just posted an activity in")) { //edge case
            return "unknown";
        }

        //TODO: parse the activity type from the text of the tweet
        // boy idfk

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
        } else { // idk. return stuff in between "a" and "in" ????
            var returnStringBeginning = tweetTextArray.indexOf("a") + 1;
            var returnStringEnd = tweetTextArray.indexOf("in");

            if (returnStringEnd === -1) {
                returnStringEnd = tweetTextArray.length;
            }

            return tweetTextArray.slice(returnStringBeginning, returnStringEnd).join(" ");
        }
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        var tweetTextArray = this.text.split(" ");
        if (tweetTextArray[4] === "mi" || tweetTextArray[4] === "km") {
            return Number.parseFloat(tweetTextArray[3]);
        } else { // activities measured in time do not have mi or km
            return 0;
        }

        // console.log(tweetTextArray);

        //format this later???
        // if (tweetTextArray.includes("mi") && 
        // (tweetTextArray.indexOf("mi") < tweetTextArray.indexOf("-"))) {
        //     var distance = tweetTextArray[tweetTextArray.indexOf("mi") - 1];
        //     return Number.parseFloat(distance);
        // } else if (tweetTextArray.includes("km") && 
        // (tweetTextArray.indexOf("km") < tweetTextArray.indexOf("-"))) {
        //     var distance = tweetTextArray[tweetTextArray.indexOf("km") - 1];
        //     return Number.parseFloat(distance);
        // } else { 
        //     // activities measured in time do not have mi or km, or at least mi/km BEFORE custom text indicator
        //     return 0;
        // }
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        var tweetTextArray = this.text.split(" ");

        var linkIndex = -1;
        for (var i = 0; i < tweetTextArray.length; i++) { // look for link location
            if (tweetTextArray[i].includes("https://t.co/")) {
                linkIndex = i;
                break;
            }
        }

        var link = "<a href=\"" + tweetTextArray[linkIndex] + "\">"; // add beginning <a> tag
        link += tweetTextArray[linkIndex]; // add URL for clickable text
        link += "</a>"; //add </a> tag
        tweetTextArray[i] = link; // insert clickable link into link location

        var tweetText = tweetTextArray.join(" ");
        var returnStr = "<td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + tweetText + "</td>";
        return returnStr;
    }
}