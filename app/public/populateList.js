var ref;

function start() {
  ref = new Firebase("https://boiling-inferno-5486.firebaseio.com/");

  ref.authWithOAuthPopup("google", function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
      onAuth(authData);
    }
  });
}

function onAuth(authData) {
  document.getElementById("mainContent").style.display = "block";

  var input = $("itemInput");
  input.onkeypress = function (e) {
    if (e.keyCode == 13) {
      var name = input.value;
      ref.push({"itemName": name});
      e.preventDefault();
      return false;
    }
  };
  
  ref.on('child_added', function(snapshot) {
     var newItem = snapshot.val();
     addNewItem(newItem.itemName);
  });
}

function addNewItem(name) {
  var newEntry = document.createElement("div");

  var text = document.createTextNode(name);
  newEntry.appendChild(text);

  var parent = document.getElementById("itemTable");
  parent.appendChild(newEntry);
};

function $(tag) {
  return document.getElementById(tag);
}


window.onload = start;
