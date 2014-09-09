var express = require('express');
var multipart = require('connect-multiparty');
var fs = require('fs');
var multipartMiddleware = multipart();
var router  = express.Router();
var mysql = require('mysql');
var client = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password:''
});

router.post('/', multipartMiddleware, function(req,res) {
	console.log(req.files.file.path);
	var tmp_path = req.files.file.path;
	var target_path = __dirname + req.files.file.name;
	fs.readFile(tmp_path, function (err, data){
	    fs.writeFile(target_path, data, function (err) {
	    	client.query('CREATE DATABASE node', function(err) {
	    		if(err){
	    			console.log('-d-d-d-d-d');
	    			client.end();
	    			throw err;
	    		}
	    	});
	    	console.log(data);
		    if(err){
		    	console.log('------');
		    }else {
		    	console.log('ddd------');
			}
		})
	})
});

module.exports = router;