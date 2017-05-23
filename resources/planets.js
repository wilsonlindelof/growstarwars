var request = require('request');
var characters = require('./characters');

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

function planetresidents(req, res, next) {
	
	console.log('planet residents');	
		
	var url_promises = [];
	/*
	* Again, there will be some null ones but to grab them all this is the easiest way to do it. 
	* I could grab a list from them with http://swapi.co/api/planets/ and http://swapi.co/api/planets/?page=2, 
	* but that would require either the same "grab everything and go over" or 
	* a sequential approach iterating through the next field of the page, but that would probably be slower than this approach.
	*/
	
	for (var i = 0; i < 70; i++) {
		var url = 'http://swapi.co/api/planets/' + i + '/';		
		url_promises.push(query_api(url));
	}
	
	var planets = {};
	var planet_data = [];
	var results = Promise.all(url_promises);
	
	results.then(function(planets_data) {			
		planet_data = planets_data;
		return characters.retrieve_all_characters();
		
			
	}, function (error) {
		console.log("api error");
		
		res.status(500)
			.json({
				status: 'failed',
				data: error,
				message: 'Server Error - Request'
			})
		
	})
	.then(function(character_data) {
		
		var character_dictionary = {};
		//splitting this into its own loop to build a dictionary to avoid a O(n^2) nested for loop (not technically n^2 since its 2 different inputs, but still unneeded runtime complexity)
		for (var i = 0; i < character_data.length; i++) {
			var character = character_data[i];
			if (!(character['detail'])) {
				character_dictionary[character['url']] = character['name'];
			}			
		}		
		
		for (var i = 0; i < planet_data.length; i++) {
			var planet = planet_data[i];
			if (!(planet['detail'])) {
				planets[planet['name']] = [];
				for (var j = 0; j < planet['residents'].length; j++) {
					var planet_resident_url = planet['residents'][j];
					planets[planet['name']].push(character_dictionary[planet_resident_url]);
				}
			}			
		}
		
		res.status(200)
			.json({
				status: 'success',
				data: planets,
				message: 'Planet residents retrieved'
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
	planetresidents: planetresidents
};
