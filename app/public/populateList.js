var ref;
var basePath = "https://boiling-inferno-5486.firebaseio.com/";
var uid;
var $ = function(tag) {return document.getElementById(tag);};

function start() {
  ref = new Firebase(basePath);
  document.getElementById("loginButton").onclick = function (e) {
    ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        // save the user's profile into the database so we can list users,
        // use them in Security and Firebase Rules, and show profiles
        ref.child("users").child(authData.uid).set({
          provider: authData.provider,
          name: authData.google.displayName
        });
        uid = authData.uid;
        onAuth(authData);
      }
    });
  }
}

function onAuth(authData) {
  document.getElementById("userName").innerHTML = authData.google.displayName;
  document.getElementById("preMain").style.display = "none";
  document.getElementById("mainContent").style.display = "block";

  var userRef = new Firebase(basePath + "/userData/" + authData.uid + "/");

  var input = document.getElementById("itemInput");
  input.onkeypress = function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      var name = input.value;
      userRef.push({"itemName": name});
      return false;
    }
  };
  
  userRef.on('child_added', function(snapshot) {
     var newItem = snapshot.val();
     addNewItem(newItem.itemName);
  });
}

function fileSelected(e) {
  console.log("Loading files")
  var count = document.getElementById('fileToUpload').files.length;
  for (var index = 0; index < count; index ++) {
    var file = document.getElementById('fileToUpload').files[index];
    var fileSize = 0;
    if (file.size > 1024 * 1024) {
      fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
    } else {
      fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
    }
    document.getElementById('details').innerHTML += 'Name: ' + file.name + '<br>Size: ' + fileSize + '<br>Type: ' + file.type;
    document.getElementById('details').innerHTML += '<p>';
  }

}

function uploadFile(e) {
  console.log("Uploading file");
  var file = document.getElementById('fileToUpload').files[0];
  var reader = new FileReader();
  reader.onload = (function(theFile) {
    return function(e) {
      var filePayload = e.target.result;
      var f = new Firebase(basePath + '/imageLoading/' + uid + "/");
      // Set the file payload to Firebase and register an onComplete handler to stop the spinner and show the preview
      f.set(filePayload, function() { 
        console.log("upload complete");
      });
    };
  })(file);
  reader.readAsDataURL(file);
}


function addNewItem(name) {
  var row = document.createElement("tr");
  var data = document.createElement("td");

  var text = document.createTextNode(name);
  data.appendChild(text);
  row.appendChild(data);

  var parent = document.getElementById("itemTable");
  parent.appendChild(row);
};

window.onload = start;
