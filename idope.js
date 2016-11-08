const request = require('request');
const fs = require('fs');

function search(term, callback){
  var headers = {
      'user-agent': '',
      'accept-encoding': 'json'
  }
  var options = {
      url: 'https://idope.se/search/'+term+'?s=3&p='+page+'&m='+max+'&o='+order,
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
var page = 1;
var max = 1;
var order = -1;

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
        console.log("[-a] \t \t [a]ssortment eg. [-a] 1 (least seeders)");
        console.log("[-h] \t \t Print [h]elp message and exit.");
        console.log("[-m] \t \t [m]ax per page, any value different from 1 will equal 29 items");
        console.log("[-o] \t \t [o]utput to file. eg. [-o] ~/Documents/out.json");
        console.log("[-p] \t \t [p]age, eg. [-p] 2");
        console.log("[-s] \t \t Read [s]earch term. eg. [-s] \"Doctor Strange\"");
        console.log("[-v] \t \t [v]erbose. Prints response to console.");
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
        case '-p':
          if(typeof process.argv[index+1] == 'undefined'){
            console.log("[-p] Page requies a value");
            process.exit();
          }
          page = parseInt(process.argv[index+1]);
          break;
        case '-a':
          if(typeof process.argv[index+1] == 'undefined'){
            console.log("[-p] Page requies a value");
            process.exit();
          }
          order = parseInt(process.argv[index+1]);
          break;
        case '-m':
          if(typeof process.argv[index+1] == 'undefined'){
            console.log("[-p] Page requies a value");
            process.exit();
          }
          max = parseInt(process.argv[index+1]);
          break;
    }
  }
});

if(term){
  search(term, function(data){callbackArr.forEach(function(val){val(data);});});
}
else{
  console.log("Need search term. e.g [-s] \"Doctor Strange\"")
}
