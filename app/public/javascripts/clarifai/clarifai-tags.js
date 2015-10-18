var clarifai = new Clarifai({id: '34EZ1WNwGt7dvL08d-k2BNfutb-ZqqOh8mmdQXNP', secret: 'QTU11PsOato83dZz5z_pxzbCapAQbtNAyMeaigIW'});

//Clarifai.initAPI(process.env.CLARIFAI_CLIENT_ID, process.env.CLARIFAI_CLIENT_SECRET);

// Setting a throttle handler lets you know when the service is unavailable because of throttling. It will let
// you know when the service is available again. Note that setting the throttle handler causes a timeout handler to
// be set that will prevent your process from existing normally until the timeout expires. If you want to exit fast
// on being throttled, don't set a handler and look for error results instead.

//Clarifai.setThrottleHandler( function( bThrottled, waitSeconds ) { 
//	console.log( bThrottled ? ["throttled. service available again in",waitSeconds,"seconds"].join(' ') : "not throttled");
//});

function filterTags(URL, tags, resultsCallback) {
	console.log("filterTags called");

	// Get a database reference to our posts
	var firebase = new Firebase("https://boiling-inferno-5486.firebaseio.com/foodwords/-K0vUW8ifj42bB3hUETz");

	tags.sort();

	// Attach an asynchronous callback to read the data at our posts reference
	firebase.once("value",
	function (foodWordsWhitelist) {
		var whitelist = foodWordsWhitelist.val();
		var filteredTags = new Array();
		var badTags = new Array();

		while( tags.length > 0 && whitelist.length > 0 )
		{   
		    if (tags[0] < whitelist[0]) {
		    	badTags.push(tags[0]);
		    	tags.shift();
		    }
		    else if (tags[0] > whitelist[0])
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