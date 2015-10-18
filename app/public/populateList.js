var ref;
var basePath = "https://boiling-inferno-5486.firebaseio.com/";
var uid;

var imgurClientID = "a7bc24269b5f209";
var imgurSecret = "5d5507dd629d18759ff61af04148513997cce638";

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
  showTags(["apple", "orange", "grapefruit", "banana"]);
  document.getElementById("userName").innerHTML = authData.google.displayName;
  var firstname = authData.google.displayName.split(" ")[0];
  var suffix = "'s";
  if (firstname.charAt(firstname.length - 1) == 's')
    suffix = "'";
  console.log(firstname.charAt(firstname.length - 1));
  document.getElementById("fridgeName").innerHTML = firstname + suffix + " Fridge"
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

function showTags(tagList) {
  var index;
  document.getElementById("tagListDiv").style.display = "block";
  var tagContainer = document.getElementById("tagList");
  tagContainer.innerHTML = "";
  for (index = 0; index < tagList.length; index++) {
    var newTag = document.createElement("a");
    newTag.onclick = function(e) {
      var tar = e.target;
      if (tar.className != "btn button-padding btn-success") {
        tar.className = "btn button-padding btn-success";
      } else {
        tar.className = "btn button-padding btn-default";
      }
    };
    var newContent = document.createTextNode(tagList[index]);
    newTag.className = "btn button-padding btn-default";
    newTag.href = "#";
    newTag.appendChild(newContent);
    tagContainer.appendChild(newTag);
  }
}

function cameraClick(e) {
  document.getElementById("fileToUpload").click();
}

function fileSelected(e) {
  console.log("Loading files")
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

  // Create our HTTP request
   var http = new XMLHttpRequest();
   http.onload = function() {
      document.getElementById("loadingIcon").style.display = "none";
      var response = JSON.parse(http.responseText);
      var url = "www.imgur.com/" + response.id;
      tagURL(url, onTags);
    }
   http.open("POST", "https://api.imgur.com/3/upload");
   http.setRequestHeader('Authorization', 'Client-ID ' + imgurClientID);

   // Append image data to formdata object
   var fd = new FormData();
   fd.append("image", file);
   http.send(fd);
}

function onTags(success, url, tags) {
  console.print(tags);
}

function addNewItem(name) {
  var row = document.createElement("tr");
  var data = document.createElement("td");

  var text = document.createTextNode(name);
  data.appendChild(text);
  row.appendChild(data);

  var input = document.createElement("td");
  input.innerHTML = "<input type=\"text\" value=\"0\">";

  var deleteButton = document.createElement("td");
  var deleteIcon = document.createElement("i");
  deleteIcon.className = "fa fa-times fa-2x";
  deleteButton.appendChild(deleteIcon);
  row.appendChild(deleteButton);


  var parent = document.getElementById("itemTable");
  parent.appendChild(row);
};

window.onload = start;
