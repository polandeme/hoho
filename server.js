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
		var b_url = /^(((ht|f)tp(s?))\:\/\/)?(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk)(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\;\?\'\\\+&amp;%\$#\=~_\-]+))*$/.test(msg.content); 
		console.log(b_url);

		if(b_url) {
			if(/(http(s))/.test(msg.content)) {
				console.log('ture');
				var url = msg.content;
			} else {
				var url = 'http:\\\\' + msg.content;
			}
			console.log(url);
			http1.get(url, function(res) {
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
			});
		} else{
			io.emit('send', msg.content);
		}
		
	});

});


var server = http.listen(3000, function() {
	console.log('listing on port %d', server.address().port)
});
