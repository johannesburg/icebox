// Initalize the clarifai API
var clarifai = new Clarifai({id: '34EZ1WNwGt7dvL08d-k2BNfutb-ZqqOh8mmdQXNP', secret: 'QTU11PsOato83dZz5z_pxzbCapAQbtNAyMeaigIW'});

//@docids ids of clarifai tags
//@param originalTags array containing all original tags sent to user
//@param addedTags new tags added by user
//@param selectedTags tags selected by user
function giveFeedback(URL, goodTags, badTags) {
    console.log("giveFeedback called");

    goodTags.forEach(function (tag) {
        clarifai.positive(URL, tag, callback).then(
            promiseResolved,
            promiseRejected
        );

        clarifai.train(tag, callback).then(
            promiseResolved,
            promiseRejected
        );
    });

    badTags.forEach(function (tag) {
        clarifai.negative(URL, tag, callback).then(
            promiseResolved,
            promiseRejected
        );

        clarifai.train(tag, callback).then(
            promiseResolved,
            promiseRejected
        );
    });


}

function promiseResolved(obj){
  console.log('Promise resolved', obj);
}

function promiseRejected(obj){
  console.log('Promise rejected', obj);
}

function callback(obj){
  console.log('callback', obj);
}


//exampleTagSingleURL(docids, ourids);