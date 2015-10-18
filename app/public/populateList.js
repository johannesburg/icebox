function start() {
  var myDataRef = new Firebase("https://boiling-inferno-5486.firebaseio.com/");
  // When we press enter
  
  var input = document.getElementById("itemInput");

  input.onkeypress = function (e) {
    if (e.keyCode == 13) {
      var name = input.value;
      myDataRef.push({"itemName": name});
      e.preventDefault();
      return false;
    }
  };
  
  myDataRef.on('child_added', function(snapshot) {
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
