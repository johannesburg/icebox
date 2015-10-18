var ref;

var $ = function(tag) {return document.getElementById(tag);};

function start() {
  ref = new Firebase("https://boiling-inferno-5486.firebaseio.com/");

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
      onAuth(authData);
    }
  });
}

function onAuth(authData) {
  document.getElementById("userName").innerHTML = authData.google.displayName;
  document.getElementById("mainContent").style.display = "block";

  var userRef = new Firebase("https://boiling-inferno-5486.firebaseio.com/userData/" + authData.uid + "/");

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
