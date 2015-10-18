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
  ref.onAuth(onAuth);
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

function cameraClick(e) {
  document.getElementById("fileToUpload").click();
}

function fileSelected(e) {
  console.log("Loading files")
  document.getElementById("loadingIcon").style.display = "block";
  document.getElementById("loadingIcon").style.display = "block";
  var count = document.getElementById('fileToUpload').files.length;
  for (var index = 0; index < count; index ++) {
    var file = document.getElementById('fileToUpload').files[index];
    var fileSize = 0;
    if (file.size > 1024 * 1024) {
      fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
    } else {
      fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
    }
  }
  console.log("Uploading file");
  var file = document.getElementById('fileToUpload').files[0];
  // Usage
  getDataUri(URL.createObjectURL(file), function(dataUri) {
     var imageRef = new Firebase(basePath + "/imageLoading/");
     imageRef.set(dataUri);
     tagLocalImage(dataUri, null, null);
  });
}

function getDataUri(url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        // Get raw image data
        callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
    };

    image.src = url;
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
