function hello(req, res, next) {
	
	console.log('hello');
	
	res.status(200)
		.json({
			status: 'success',
			data: [],
			message: 'Hello World!'
		});
		
}

module.exports = {
	hello: hello
};
