var express = require('express'),
	mongoose = require('mongoose'),
	fs = require('fs');

var app = express();
app.use(express.logger());
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use("/", express.static(__dirname + "/"));
app.use("/", express.static(__dirname + "/static"));

mongoose.connect('mongodb://localhost/altaviel');

//mongoose error handler
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function callback() {});

var Schema = mongoose.Schema;

var requestSchema = new Schema({
	lat: String,
	long: String,
	title: String,
	problem_text: String,
	type: Number, // 1 - auto, 2 - comp, 3 - life, 4 - drop
	severity: Number,
	requestor: { type: Number, ref: 'Person' },
	helper: { type: Number, ref: 'Person' }
});

var personSchema = new Schema({
	name: String,
	nickname: String,
	email: String,
	requests: [{ type: Schema.Types.ObjectId, ref: 'Request' }]
});

mongoose.model('Person', personSchema);
mongoose.model('Request', requestSchema);



var buf = fs.readFileSync('index.html');
var string = buf.toString();

app.get('/', function(request, response) {
	response.send(string);
});

app.post('/requests', function(req, res) {
	console.log(req.body);
	return res.send(req.body);
});

app.listen(3000, function() {
	console.log("Listening on 3000");
});