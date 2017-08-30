require("firebase/database");
require("jquery");

var database = firebase.database();
var ref = database.ref('projects');

PUSH_TO_TEMPLATE_projectsList();

function PUSH_TO_TEMPLATE_projectsList(){
  // Sobald sich Daten ändern wird diese Funktion aufgerufen
  ref.on('value', function(data){
    data = data.val()
    $('.features > section').empty();
    console.log('Project list updating...');
    Object.keys(data).forEach(function(key) {
      var val = data[key];
      $('.features > section').append('<h3>' + data[key].projectName + '</h3>')
                              .append('<p>' + data[key].projectFilepath + '</p>');
    });
  }, function(error){
    console.error(error);
  });
}
