--Readme document for Isabella Nguyen, ipnguye1@uci.edu--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 3/3 Summarizing tweets
- 4/4 Identifying the most popular activities
- 3/3 Adding a text earch interface

2. How long, in hours, did it take you to complete this assignment?
I took around 22 hours to finish this assignment.

3. What online resources did you consult when completing this assignment? (list sites like StackOverflow or specific URLs for tutorials; describe queries to Generative AI or use of AI-based code completion)
tweet.ts:
https://www.w3schools.com/jsref/jsref_startswith.asp
https://stackoverflow.com/a/493018 (date comparisons)
https://www.w3schools.com/js/js_comparisons.asp
https://www.w3schools.com/jsref/jsref_includes.asp
https://www.w3schools.com/jsref/jsref_indexof.asp
https://www.w3schools.com/jsref/jsref_substring.asp
https://www.w3schools.com/jsref/jsref_slice_array.asp
https://www.w3schools.com/jsreF/jsref_indexof_array.asp
https://www.w3schools.com/jsref/jsref_join.asp
https://www.w3schools.com/jsref/jsref_split.asp
https://www.w3schools.com/jsref/jsref_number_parsefloat.asp
https://www.geeksforgeeks.org/typescript/how-to-convert-string-to-number-in-typescript/

about.js:
https://mathjs.org/docs/reference/functions/format.html
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString

activities.js:
https://www.w3schools.com/js/js_switch.asp
https://vega.github.io/vega-lite/examples/window_top_k.html
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
https://vega.github.io/vega-lite/docs/sort.html
https://vega.github.io/vega/docs/transforms/filter/
https://stackoverflow.com/a/20441059 (used this to hide graphs)
https://www.w3schools.com/jsref/jsref_push.asp
https://vega.github.io/vega-lite/docs/sort.html
https://vega.github.io/vega-lite/docs/aggregate.html
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
https://vega.github.io/vega-lite/examples/window_top_k.html
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

descriptions.js:
https://www.w3schools.com/jsref/jsref_filter.asp
https://www.w3schools.com/jsref/jsref_tolowercase.asp
https://www.w3schools.com/jsref/met_document_addeventlistener.asp
https://www.w3schools.com/jsref/met_node_removechild.asp
https://www.w3schools.com/jsref/jsref_tolowercase.asp
https://www.w3schools.com/jsref/prop_html_innerhtml.asp
https://www.w3schools.com/js/js_async.asp
https://www.w3schools.com/jsref/met_node_appendchild.asp
https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event
https://www.w3schools.com/jsref/met_document_createelement.asp
https://www.w3schools.com/js/js_promise.asp
https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/value


4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
I compared results with Amelie Sicat for about.js and activities.js.


5. Is there anything special we need to know in order to run your code?
For descriptions.js, I edited the default DOMContentLoaded listener code to run loadSavedRunkeeperTweets().then(parseTweets) before addEventHandlerForSearch() because my search code cannot work otherwise. I also added custom functions for my code to work.
For activities.js, I edited the default DOMContentLoaded listener code to also add an event listener for the button that switches graphs. I also made a function of my own for the event listener.