var ref;
var userRef;
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
  if (uid != null && authData == null) {
    uid = null;
    location.reload();
  }
  document.getElementById("userName").innerHTML = authData.google.displayName;
  var firstname = authData.google.displayName.split(" ")[0];
  var suffix = "'s";
  if (firstname.charAt(firstname.length - 1) == 's')
    suffix = "'";
  document.getElementById("fridgeName").innerHTML = firstname + suffix + " Fridge"
  document.getElementById("preMain").style.display = "none";
  document.getElementById("mainContent").style.display = "block";

  userRef = new Firebase(basePath + "/userData/" + authData.uid + "/");

  var input = document.getElementById("itemInput");
  input.onkeypress = function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      var name = input.value;
      userRef.push({"itemName": name, "itemCount": 1});
      return false;
    }
  };

  var submitButton = document.getElementById("submitItem");
  submitButton.onclick = function (e) {
    var name = input.value;
    userRef.push({"itemName": name, "itemCount": 1});
  }

  document.getElementById("logout").onclick = function (e) {
    ref.unauth();
  }
  
  userRef.on('child_added', function(snapshot) {
    addNewItem(snapshot);
    showDBSpinner();
  });

  userRef.on('child_changed', function(snapshot) {showDBSpinner();});
  userRef.on('child_removed', function(snapshot) {showDBSpinner();});
}

function showDBSpinner() {
  var spinner = document.getElementById("updateDBSpinner");
  spinner.style.display = "inline-block";
  setTimeout((function () { spinner.style.display = "none"; }), 600);
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
  document.getElementById("imageInput").style.display = "none";
  document.getElementById("imageOutputDiv").style.display = "block";
  var img = document.createElement("img");
  img.width = "200";
  img.height = "200";
  showImage(file, img);
  document.getElementById("imageOutput").appendChild(img);
  // Create our HTTP request
   var http = new XMLHttpRequest();
   http.onload = function() {
      document.getElementById("loadingIcon").style.display = "none";
      var response = JSON.parse(http.responseText);
      console.log(http.responseText);
      var url = "http://www.i.imgur.com/" + response.data.id + ".jpg";
      console.log(url);
      tagURL(url, onTags);
    }
   http.open("POST", "https://api.imgur.com/3/upload");
   http.setRequestHeader('Authorization', 'Client-ID ' + imgurClientID);

   // Append image data to formdata object
   var fd = new FormData();
   fd.append("image", file);
   http.send(fd);
}

function showImage(file,target) {
  var fr=new FileReader();
  // when image is loaded, set the src of the image where you want to display it
  fr.onload = function(e) { target.src = this.result; };
  // fill fr with image data    
  fr.readAsDataURL(file);
}

function onTags(success, url, tags) {
  if (success) {
    showTags(tags);
  }
}

function submitTags() {

}

function addNewItem(accessRef) {
  var count = accessRef.child("itemCount").val();
  var name = accessRef.child("itemName").val();
  var row = document.createElement("tr");
  row.id = name;
  var data = document.createElement("td");
  data.className = "col-sm-5";

  var text = document.createTextNode(name);
  data.appendChild(text);
  row.appendChild(data);

  var input = document.createElement("td");
  input.className = "col-sm-2";
  var inputField = document.createElement("input");
  inputField.type = "number";
  inputField.style = "max-width: 50px";
  inputField.value = count;
  inputField.min = 1;
  inputField.className = "text-center";
  input.appendChild(inputField);
  input.onchange = function(e) {
    userRef.child(accessRef.key()).update({"itemCount": inputField.value});
  }
  row.appendChild(input);

  var deleteButton = document.createElement("td");
  deleteButton.className = "col-sm-5";
  var deleteIcon = document.createElement("i");
  deleteIcon.onclick = function(e) {
    var row = document.getElementById(name);
    row.parentNode.removeChild(row);
    userRef.child(accessRef.key()).remove();
  };
  deleteIcon.className = "fa fa-times fa-2x";
  deleteButton.appendChild(deleteIcon);
  row.appendChild(deleteButton);


  var parent = document.getElementById("itemTable");
  parent.appendChild(row);
};

window.onload = start;
