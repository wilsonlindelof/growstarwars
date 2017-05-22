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
				var parsed_object = JSON.parse(body);
				resolve(parsed_object);
			}
		});
		
	});
}

function sort_characters(characters, param) {
	if (param == 'mass' || param == 'height') {
		return characters.sort(function(a, b) {
			return a[param] - b[param];
		});
	} else {
		return characters.sort(function(a, b) {			
			return a[param].localeCompare(b[param]);
		});
	}
	
			
}

function retrieve_characters(req, res, next) {
	
	console.log('retrieve characters');	
		
	var url_promises = [];
	for (var i = 0; i < 80; i++) {
		var url = 'http://swapi.co/api/people/' + i + '/';		
		url_promises.push(query_api(url));
	}
	
	var characters = [];		
	var results = Promise.all(url_promises);
	
	results.then(function(data) {
		
		for (var i = 0; i < data.length; i++) {
			var character = data[i];
			if (!(character['detail']) && characters.length < 50) { //detail is only on the "Not Found" results
				characters.push(character);
			}
		}
		
		if (req.query['sort']) {			
			characters = sort_characters(characters, req.query['sort']);			
		}		
		
		res.status(200)
			.json({
				status: 'success',
				data: characters,
				message: 'Characters retrieved'
			});
	}, function (error) {
		console.log("api error");
		
		res.status(500)
			.json({
				status: 'failed',
				data: error,
				message: 'Server Error - Request'
			})
		
	});
	
}

function retrieve_character(req, res, next) {
	
	console.log('retrieve character');
	var name = req.params.name;	
		
	var url_promises = [];
	for (var i = 0; i < 100; i++) {//this makes it execute slower since it takes a while to return a "Not Found" for some of them, but I did it this way to be sure I grabbed all possible matches for the name
		var url = 'http://swapi.co/api/people/' + i + '/';		
		url_promises.push(query_api(url));
	}
	
	var characters = [];		
	var results = Promise.all(url_promises);
	
	results.then(function(data) {
				
		for (var i = 0; i < data.length; i++) {
			var character = data[i];			
			if (character['name'] && character['name'].toUpperCase().indexOf(name.toUpperCase()) != -1) {
				console.log(character);
				//need to return in ejs
				res.status(200)
					.json({
						status: 'success',
						data: character,
						message: 'Character retrieved'
					});
				return;
			}
		}
		
		res.status(500)
			.json({
				status: 'failed',
				data: [],
				message: 'Server Error - Request'
			});
		
	}, function (error) {
		console.log("api error");
		
		res.status(500)
			.json({
				status: 'failed',
				data: error,
				message: 'Server Error - Request'
			})
		
	});
	
}

module.exports = {
	hello: hello,
	retrieve_characters: retrieve_characters,
	retrieve_character: retrieve_character
};
