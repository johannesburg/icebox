process.env['CLARIFAI_CLIENT_ID'] = '34EZ1WNwGt7dvL08d-k2BNfutb-ZqqOh8mmdQXNP';
process.env['CLARIFAI_CLIENT_SECRET'] = 'QTU11PsOato83dZz5z_pxzbCapAQbtNAyMeaigIW';

var Clarifai = require('./clarifai-node.js');

Clarifai.initAPI(process.env.CLARIFAI_CLIENT_ID, process.env.CLARIFAI_CLIENT_SECRET);

// Setting a throttle handler lets you know when the service is unavailable because of throttling. It will let
// you know when the service is available again. Note that setting the throttle handler causes a timeout handler to
// be set that will prevent your process from existing normally until the timeout expires. If you want to exit fast
// on being throttled, don't set a handler and look for error results instead.

Clarifai.setThrottleHandler( function( bThrottled, waitSeconds ) { 
	console.log( bThrottled ? ["throttled. service available again in",waitSeconds,"seconds"].join(' ') : "not throttled");
});

function filterTags(tags) {
	var filteredTags = tags;
	//filter tags
	return filteredTags;
}

function commonResultHandler(err, res, resultsCallback) {
	if( err != null ) {
		if( typeof err["status_code"] === "string" && err["status_code"] === "TIMEOUT") {
			resultsCallback(false, "", "", "");
			console.log("TAG request timed out");
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "ALL_ERROR") {
			resultsCallback(false, "", "", "");
			console.log("TAG request received ALL_ERROR. Contact Clarifai support if it continues.");				
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "TOKEN_FAILURE") {
			resultsCallback(false, "", "", "");
			console.log("TAG request received TOKEN_FAILURE. Contact Clarifai support if it continues.");				
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "ERROR_THROTTLED") {
			resultsCallback(false, "", "", "");
			console.log("Clarifai host is throttling this application.");				
		}
		else {
			resultsCallback(false, "", "", "");
			console.log("TAG request encountered an unexpected error." + err);		
		}
	}
	else {
		// if some images were successfully tagged and some encountered errors,
		// the status_code PARTIAL_ERROR is returned. In this case, we inspect the
		// status_code entry in each element of res["results"] to evaluate the individual
		// successes and errors. if res["status_code"] === "OK" then all images were 
		// successfully tagged.
		if( typeof res["status_code"] === "string" && 
			( res["status_code"] === "OK" || res["status_code"] === "PARTIAL_ERROR" )) {

			// the request completed successfully
			for( i = 0; i < res.results.length; i++ ) {
				if( res["results"][i]["status_code"] === "OK" ) {
					resultsCallback(true,
						res.results[i].local_id,
						res.results[i].docid,
						filterTags(res["results"][i].result["tag"]["classes"]))
				}
				else {
					resultsCallback(false,
						res.results[i].local_id,
						res.results[i].docid,
						"")
				}
			}
		}			
	}
}


// Takes a url for a picture and a local ID for the url.
// Calls resultsCallback which should be a function which takes a boolean representing success, a local id string, a doc id, and an array of tags
function tagURL(URL, localId, resultCallback) {
	Clarifai.tagURL( URL , localId, function (errors, results) {commonResultHandler(errors, results, resultCallback)}); 
}

// Takes an array of urls for pictures and an array of local IDs for each url.
// Calls resultsCallback multiple times. It should be a function which takes a boolean representing success, a local id string, a doc id, and an array of tags
function tagURLs(URLs, localIds, resultsCallback) {
	Clarifai.tagURL( URLs , localIds, function (errors, results) {commonResultHandler(errors, results, resultsCallback)}); 
}

tagURL("http://www.travelingwellforless.com/wp-content/uploads/2016/01/groceries.jpg",
	"canadian groceries", 
	function (success, localId, docId, tags) {
		if (!success)
			console.log("error: " + localId);
		else {
			console.log(localId);
			console.log(tags);
		}});

Clarifai.clearThrottleHandler();