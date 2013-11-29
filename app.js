var express = require('express');

var app = express();

app.use(express.logger())
app.use("/", express.static(__dirname+"/"));
app.use("/", express.static(__dirname+"/static"));

var fs = require('fs');
var buf = fs.readFileSync('index.html');
var string = buf.toString();


app.get('/', function(request, response) {
  response.send(string);
});

app.listen(3000, function() {
  console.log("Listening on 3000");
});
