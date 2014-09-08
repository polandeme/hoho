var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http1 = require('http');
var cheerio = require('cheerio');
var path = require('path');
// var iconv = require('iconv-lite');
var request = require('request');
var http = http1.createServer(app);
var io = require('socket.io').listen(http);


app.use(express.static(path.join(__dirname, 'lib')));

app.use(bodyParser());

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

var upload = require('./routes/test');
app.use('/upload', upload);
// app.use(express.bodyParser());
// app.use( bodyParser.json() );

io.on('connection', function(socket) {
	console.log('a user connected');
	socket.on('send', function(msg) {
		var data = '';
		var b_url = /^(((ht|f)tp(s?))\:\/\/)?(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk)(\.cn)?(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\;\?\'\\\+&amp;%\$#\=~_\-]+))*$/.test(msg.content); 
		console.log(b_url);

		if(b_url) {
			if(msg.content.indexOf('http') === 0) {
				var url = msg.content;
			} else {
				var url = 'http:\\\\' + msg.content;
			}
			console.log(url);
			request.get(url, function(e, res, body) {

				res.setEncoding('utf-8');
				var html = body.toString();
				var $ = cheerio.load(html);
				var mesage = $('title').text();
				var content = {
					type: 'url',
					msg: mesage,
					add: url
				};
				console.log(res.headers);
				io.emit('send', content);

				// res.on('data', function (chunk) {
				// 	console.log('datadd');
				// 	data += chunk;
				// });

				// res.on('end', function() {
				// 	console.log('end');
				// 	var html = data.toString();
				// 	var $ = cheerio.load(html);
				// 	var mesage = $('title').text();
				// 	// iconv.decode(mesage, 'utf8');
				// 	// console.log(mesage);
				// 	console.log(mesage);
				// 	io.emit('send', mesage);
				// })
				// .on('error', function() {
				// 	console.log('-=-=-=-=-');
				// 	io.emit('send', 'error');
				// });
			})
			// http1.get(url, function(res) {
			// 	console.log(res.headers['content-type']);
			// 	res.setEncoding('utf-8');

			// 	res.on('data', function (chunk) {
			// 		data += chunk;
			// 	});

			// 	res.on('end', function() {
			// 		var html = data.toString();
			// 		var $ = cheerio.load(html);
			// 		var mesage = $('title').text();
			// 		// iconv.decode(mesage, 'utf8');
			// 		// console.log(mesage);
			// 		io.emit('send', mesage);
			// 	})
			// 	.on('error', function() {
			// 		console.log('-=-=-=-=-');
			// 		io.emit('send', 'error');
			// 	});
			// });
		
		} else{
			// iconv.decode(msg.content, 'utf8');
			// msg.content.toString('utf-8');
			console.log('bupipi');
			var content = {
				type: 'msg',
				msg: msg.content,
				img: 'img/test.jpg'
			}
			io.emit('send', content);
		}
		
	});

});


var server = http.listen(3000, function() {
	console.log('listing on port %d', server.address().port)
});
