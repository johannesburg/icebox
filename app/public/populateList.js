var myDataRef = new Firebase('https://mo9gnntyjxw.firebaseio-demo.com/');
// When we press enter
$('#itemInput').keypress(function (e) {
  if (e.keyCode == 13) {
    var name = $('#itemInput').val();
    myDataRef.push({itemName: name});
    $('#itemInput').val('');
  }
});
myDataRef.on('child_added', function(snapshot) {
   var newItem = snapshot.val();
   addNewItem(newItem.itemName);
});
function addNewItem(name) {
  var newEntry = document.createElemtn("p");
  var text = document.createTextNode(name);
  newEntry.appendChild(text);

  var parent = document.getElementById("itemTable");
  parent.appendChild(newEntry);
};