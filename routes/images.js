var express = require('express');
var multipart = require('connect-multiparty');
var fs = require('fs');
var multipartMiddleware = multipart();
var router  = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password:'',
	database: 'hoho'
});
connection.connect();
router.post('/', multipartMiddleware, function(req,res) {
	console.log(req.files.file.path);
	var tmp_path = req.files.file.path;
	var target_path = __dirname + req.files.file.name;
	fs.readFile(tmp_path, function (err, data){
	    fs.writeFile(target_path, data, function (err) {
	    	var post = {
	    			url_date: new Date().getTime(),
	    			url_vote_up: 0,
	    			url_vote_down: 0,
	    			url_del: 0,
	    			// url_add: 
	    			url_title: 'dsss'
	    		}
	    	connection.query('INSERT INTO ho_url SET ?', post,  function(err,  result) {
	    		if(err) {
	    			console.log('error insert');
	    		}else {
	    			console.log('success ');
	    		}
	    	});

		    if(err){
		    	console.log('------');
		    }else {
		    	console.log('ddd------');
			}
		})
	})
});

module.exports = router;