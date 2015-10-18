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

function commonResultHandler(err, res, resultsCallback) {
	if( err != null ) {
		if( typeof err["status_code"] === "string" && err["status_code"] === "TIMEOUT") {
			resultsCallback(false, "TAG request timed out");
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "ALL_ERROR") {
			resultsCallback(false, "TAG request received ALL_ERROR. Contact Clarifai support if it continues.");				
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "TOKEN_FAILURE") {
			resultsCallback(false, "TAG request received TOKEN_FAILURE. Contact Clarifai support if it continues.");				
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "ERROR_THROTTLED") {
			resultsCallback(false, "Clarifai host is throttling this application.");				
		}
		else {
			resultsCallback(false, "TAG request encountered an unexpected error." + err);		
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
						'docid='+res.results[i].docid +
						' local_id='+res.results[i].local_id +
						' tags='+res["results"][i].result["tag"]["classes"] )
				}
				else {
					resultsCallback(true, 
						'docid='+res.results[i].docid +
						' local_id='+res.results[i].local_id + 
						' status_code='+res.results[i].status_code +
						' error = '+res.results[i]["result"]["error"] )
				}
			}
		}			
	}
}


// Takes a url for a picture and a local ID for the url.
// Calls resultsCallback which whould be a function which takes a boolean indicating sucess and a string. If the request
// succeeded then the string will contain the result, otherwise an error message.
function tagURL(URL, localId, resultCallback) {
	Clarifai.tagURL( URL , localId, function (errors, results) {commonResultHandler(errors, results, resultCallback)}); 
}

// Takes an array of urls for pictures and an array of local IDs for each url. The two arrays must be of the same length.
// Calls resultsCallback which whould be a function which takes a boolean indicating sucess and a string. If the request
// succeeded then the string will contain the result, otherwise an error message.
function tagURLs(URLs, localIds, resultsCallback) {
	if (URLs.length != localIds.length)
		resultsCallback(false, "ERROR - list of URLs and local IDs do not have the same length!");


	Clarifai.tagURL( URLs , localIds, function (errors, results) {commonResultHandler(errors, results, resultsCallback)}); 
}

tagURL("http://www.travelingwellforless.com/wp-content/uploads/2016/01/groceries.jpg", "canadian groceries", function (success, message) {console.log(message)})

Clarifai.clearThrottleHandler();