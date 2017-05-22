var request = require('request');

function hello(req, res, next) {
	
	console.log('hello');
	
	res.status(200)
		.json({
			status: 'success',
			data: [],
			message: 'Hello World!'
		});
		
}

var query_api = function api_query(url) {
	
	return new Promise(function(resolve, reject){
		
		request(url, function(error, response, body) {
			if (error) {
				console.log(error);
				reject(error);
			} else {
				console.log(body);
				var parsed_object = JSON.parse(body);
				resolve(parsed_object);
			}
		});
		
	});
}

function retrieve_characters(req, res, next) {
	
	console.log('retrieve characters');
	
	var urls = [];
	var url_promises = [];
	for (var i = 0; i < 50; i++) {
		var url = 'http://swapi.co/api/people/' + i + '/';
		urls.push(url);
		url_promises.push(query_api(url));
	}
	
	var characters = [];	
	/*for (var i = 0; i < urls.length; i++) {
		var url = urls[i];
		
	}*/
	var results = Promise.all(url_promises);
	
	results.then(function(data) {
		console.log(data);
		res.status(200)
			.json({
				status: 'success',
				data: data,
				message: 'Characters retrieved'
			});
	});
	
	//console.log(characters);
	//console.log("returning now");
		
}

module.exports = {
	hello: hello,
	retrieve_characters: retrieve_characters
};
