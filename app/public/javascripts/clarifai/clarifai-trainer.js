var Clarifai = require('./clarifai-basic.js');

process.env['CLARIFAI_CLIENT_ID'] = '34EZ1WNwGt7dvL08d-k2BNfutb-ZqqOh8mmdQXNP';
process.env['CLARIFAI_CLIENT_SECRET'] = 'QTU11PsOato83dZz5z_pxzbCapAQbtNAyMeaigIW';

//Clarifai.initAPI(process.env.CLARIFAI_CLIENT_ID, process.env.CLARIFAI_CLIENT_SECRET);

var clarifai = new Clarifai({id: process.env.CLARIFAI_CLIENT_ID, secret: process.env.CLARIFAI_CLIENT_SECRET});

function commonResultHandler( err, res ) {
  if( err != null ) {
    if( typeof err["status_code"] === "string" && err["status_code"] === "TIMEOUT") {
      console.log("TAG request timed out");
    }
    else if( typeof err["status_code"] === "string" && err["status_code"] === "ALL_ERROR") {
      console.log("TAG request received ALL_ERROR. Contact Clarifai support if it continues.");       
    }
    else if( typeof err["status_code"] === "string" && err["status_code"] === "TOKEN_FAILURE") {
      console.log("TAG request received TOKEN_FAILURE. Contact Clarifai support if it continues.");       
    }
    else if( typeof err["status_code"] === "string" && err["status_code"] === "ERROR_THROTTLED") {
      console.log("Clarifai host is throttling this application.");       
    }
    else {
      console.log("TAG request encountered an unexpected error: ");
      console.log(err);       
    }
  }
  else {
    if( opts["print-results"] ) {
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
            console.log( 'docid='+res.results[i].docid +
              ' local_id='+res.results[i].local_id +
              ' tags='+res["results"][i].result["tag"]["classes"] )
          }
          else {
            console.log( 'docid='+res.results[i].docid +
              ' local_id='+res.results[i].local_id + 
              ' status_code='+res.results[i].status_code +
              ' error = '+res.results[i]["result"]["error"] )
          }
        }

      }
    }     
  }
}

//helper function
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

//@docids ids of clarifai tags
//@param originalTags array containing all original tags sent to user
//@param addedTags new tags added by user
//@param selectedTags tags selected by user
function giveFeedback(docids, originalTags, addedTags, selectedTags) {
  val removeTags = originalTags.diff(selectedTags);
  Clarifai.feedbackAddTagsToDocids(docids, addTags, null,null);
  Clarifai.feedbackRemoveTagsFromDocids(docids, removeTags, null, null);
  //TODO: add correctTags to whitelist
}

exampleTagSingleURL(docids, ourids);