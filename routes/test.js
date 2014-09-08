var express = require('express');
var multipart = require('connect-multiparty');
var fs = require('fs');
var multipartMiddleware = multipart();
var router  = express.Router();

router.post('/', multipartMiddleware, function(req,res) {
	console.log(req.files.file.path);
	var tmp_path = req.files.file.path;
	var target_path = __dirname + req.files.file.name;
	// console.log(req.body);
	fs.readFile(tmp_path, function (err, data){
	    fs.writeFile(target_path, data, function (err) {
	    	console.log(data);
		    if(err){
		    	console.log('------');
		    }else {
		    	console.log('ddd------');
			}
		})
	})
	// console.log(target_path);
// console.log(req.file);
// res.send('hello test');

});

module.exports = router;