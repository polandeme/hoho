var app = require('express')();
var http1 = require('http');
var cheerio = require('cheerio');
var http = http1.createServer(app);
var io = require('socket.io').listen(http);

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

io.on('connection', function(socket) {
	console.log('a user connected');
	socket.on('send', function(msg) {
		var data = '';
		console.log(msg.content);
		http1.get(msg.content, function(res) {
			console.log('-------------');
			res.setEncoding('utf8');

			res.on('data', function (chunk) {
				data += chunk;
			});

			res.on('end', function() {
				console.log('======');
				var html = data.toString();
				var $ = cheerio.load(html);
				io.emit('send', $('title').text());
			})
			.on('error', function() {
				console.log('-=-=-=-=-');
				io.emit('send', 'error');
			});
			// console.log(res.statusCode);
			// io.emit('send', res.statusCode);
		});
		// io.emit('send', msg);	
	});

});


var server = http.listen(3000, function() {
	console.log('listing on port %d', server.address().port)
});
