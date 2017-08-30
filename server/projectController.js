class Project {
  constructor(name, filepath){
    this.name = name;
    this.filepath = filepath;
  }
}

const fs = require('fs');
const path = require('path');

require("firebase/database");
var database = firebase.database();
var ref = database.ref('projects');

var projectPath;

$('#saveProjectPath').click(function(){
  var app = require('electron').remote;
  var dialog = app.dialog;
  dialog.showOpenDialog({
    title:"Select a folder",
    properties: ["openDirectory"]
    }, (folderPaths) => {
    // folderPaths is an array that contains all the selected paths
    if(folderPaths === undefined){
        console.log("No destination folder selected");
        return;
    }else{
        projectPath = folderPaths;
        console.log(projectPath);
    }
  });
});

function createNewProject(){
  var projectName = $('#projectName').val();
  // TODO: filepath muss später mit der Ordnerauswahl ersetzt werden.

  var project = new Project(projectName, projectPath);

  var data = {
    projectName: projectName,
    projectFilepath: projectPath
  }
  // Übergibt Projektdaten an Firebase Datenbank
  writeProjectData(data.projectName, data.projectName, data.projectFilepath[0]);
  setTimeout(function(){
    createNewCommit(data.projectName, data.projectFilepath[0])
  }, 3000);

}

function createNewCommit(projectName, projectFilepath){
  // TODO Funktion soll nur ID nehmen und daraus sich den Filepath der Datenbank
  // ziehen um neuen Commit zu erstellen
  var archiver = require('archiver');
  var filepath = projectFilepath ;
  //Schaue ob im Projektordner ein .komet Ordner da ist und erstelle ihn ggf.
  var dir = __dirname + '/.komet';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    console.log(dir + ' was created!');
  }

  // TODO: Dateiname braucht noch einen Identifier
  var date = Date.now();

  var tempPath = '../.komet/'+ projectName + '-' +  date + '.zip';
  var output = fs.createWriteStream(path.join(__dirname, tempPath));

  var archive = archiver('zip', {
    gzip: true,
    zlib: { level: 9 } // Sets the compression level.
  });

  archive.on('error', function(err) {
    throw err;
  });

  output.on('close', function() {
    console.log('Archiv wurde erstellt mit einer Größe von ' + archive.pointer() + 'bytes');
  });

  // pipe archive data to the output file
  archive.pipe(output);

  //Besorgt alle daten aus einem Ordner
  archive.directory(filepath, false);
  archive.finalize();
}

function writeProjectData(projectId, projectName, projectFilepath) {
  firebase.database().ref('projects/' + projectId).set({
    projectId: projectId,
    projectName: projectName,
    projectFilepath : projectFilepath
  });
}
