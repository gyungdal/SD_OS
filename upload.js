module.exports = {
	'init' : function(app){
		init(app);
	}
}

function init(app){
	app.all('/login', function (req, res) {
		console.log(req.path);
		res.send("Hello World!");
	});
}