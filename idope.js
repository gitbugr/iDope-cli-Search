const request = require('request');
const fs = require('fs');

function search(term, callback){
  var headers = {
      'user-agent': '',
      'accept-encoding': 'json'
  }
  var options = {
      url: 'https://idope.se/search/'+term+'?s=3', // o=1 Order?, m=-1 ???, p=1 Page?
      method: 'GET',
      headers: headers
  }
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      this.callback(body);
    }
  }.bind({callback:callback}));
}

var callbackArr = [];
var term = null;

process.argv.forEach(function (val, index, array) {
  if(index>1){
    switch(val) {
      case '-h':
        console.log("");
        console.log("iDope cli Search");
        console.log("----------------");
        console.log("Author: Kyron Taylor");
        console.log("Source Code: https://github.com/gitbugr/iDope-cli-Search");
        console.log("Description: Command line tool to search the iDope torrent search engine.");
        console.log("--");
        console.log("Usage: node idope.js [-s] <search_term> [options]");
        console.log("Options:");
        console.log("-h \t \t Print this message and exit.");
        console.log("-o \t \t Output to file. eg. -o ~/Documents/out.json");
        console.log("-s \t \t Read search term. eg. -s \"Doctor Strange\"");
        console.log("-v \t \t Verbose. Prints response to console.");
        console.log("");
        process.exit();
        break;
      case '-s':
        if(typeof process.argv[index+1] == 'undefined'){
          console.log("Need search term.");
          process.exit();
        }
        term = process.argv[index+1];
        break;
      case '-o':
        callbackArr.push(function(data){
          if(typeof process.argv[index+1] !== 'undefined'){
            fs.writeFile(process.argv[index+1], data, function(err) {
                if(err) { return console.log(err); }
                console.log("");
                console.log("Saved to: "+process.argv[index+1]);
                console.log("");
            });
          }
        });
        break;
        case '-v':
          callbackArr.push(function(data){
            console.log(data);
          });
          break;
    }
  }
});

if(term){
  search(term, function(data){callbackArr.forEach(function(val){val(data);});});
}
else{
  console.log("Need search term. e.g ")
}
