//require/imports
var port = process.env.PORT || 8090;
var express = require('express');	
var http = require('http');
var app = express();
var bodyParser = require('body-parser');

//resource files
var characters = require('./resources/characters');	


var router = express.Router();

console.log("Starting server");

//called on every request.
router.use(function(req, res, next) {

	//allow CORS
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	next();
});

router.use(bodyParser.json());	

//routes	
router.get('/hello', characters.hello);	


app.use('/api', router);
http.createServer(app).listen(port);
console.log("Started server on port: " + port);