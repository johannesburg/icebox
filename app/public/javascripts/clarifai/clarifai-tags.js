// Initalize the clarifai API
var clarifai = new Clarifai({id: '34EZ1WNwGt7dvL08d-k2BNfutb-ZqqOh8mmdQXNP', secret: 'QTU11PsOato83dZz5z_pxzbCapAQbtNAyMeaigIW'});

// Takes a URL represented by a string, an array of tags, and a callback which takes a boolean,
// URL represented by a string, and an array of tags. Filters the array of tags before passing
// them through to the callback. The boolean in the callback will be true on sucess and false
// on failure.
function filterTags(URL, tags, resultsCallback) {
	console.log("filterTags called");

	// Get a database reference to our posts
	var firebase = new Firebase("https://boiling-inferno-5486.firebaseio.com/foodwords/-K0vUW8ifj42bB3hUETz");

	tags.sort();

	// Attach an asynchronous callback to read the data at our posts reference
	firebase.once("value",
	function (foodWordsWhitelist) {
		var whitelist = foodWordsWhitelist.val();

		console.log(whitelist);

		var filteredTags = new Array();
		var badTags = new Array();

		while( tags.length > 0 && whitelist.length > 0 )
		{   
			var whiteListTag = whitelist[0].split("\"")[1];
		    if (tags[0] < whiteListTag) {
		    	badTags.push(tags[0]);
		    	tags.shift();
		    }
		    else if (tags[0] > whiteListTag)
		    	whitelist.shift();
		    else {
			    filteredTags.push(tags.shift());
			    whitelist.shift();
		    }
		}
		resultsCallback(true, URL, filteredTags);
		console.log("resultsCallback returned");

		giveFeedback(URL, new Array(), badTags);
		console.log("giveFeedback returned");
	});
}

// Takes a url for a picture and a local ID for the url.
// Calls resultsCallback which should be a function which takes a boolean representing success, and an array of tags
function tagURL(URL, resultsCallback) {
	console.log("tagURL called");

	clarifai.tag(URL).then(
		function (result) {
			filterTags(URL, 
				result['body']['results'][0]['result']['tag']['classes'],
				resultsCallback
			);
		}
	);
}