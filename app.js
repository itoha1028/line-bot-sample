/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

var express = require('express');
var server = express();

var bodyParser = require('body-parser');
var request = require('request');

// Bluemix Configuration	
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();


server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());  


server.post('/', function(req, res){
	var reqBody = req.body;
	sendBotMessage(reqBody);
	
	res.writeHead(200);
	res.end();

});
server.listen(appEnv.port || 30000);
console.log('Server running at Bluemix');



function sendBotMessage(reqBody){
		
	var headers = {
		'Content-Type': 'application/json; charset=UTF-8',
		'X-Line-ChannelID': process.env.LINE_CHANNEL_ID,
		'X-Line-ChannelSecret': process.env.LINE_CHANNEL_SECRET,
		'X-Line-Trusted-User-With-ACL': process.env.LINE_MID
	}
	
	var toArray = [];
	toArray.push(reqBody['result'][0]['content']['from']);

	var content = { 
		'contentType': 1,
		'toType': 1,
		'text': reqBody['result'][0]['content']['text']
	};
	
	var options = {
		url: 'https://trialbot-api.line.me/v1/events',
		method: 'POST',
		headers: headers,
		json: true,
		body: {
				'to': toArray,
 				'toChannel': 1383378250,	// fixed value
 				'eventType': '138311608800106203',	// fixed value
 				'content': content
  		}
	}
	
	request.post(options, function(error, response, body){
		if (!error && response.statusCode == 200) {
       		console.log(body);
		} else {
			console.log('error: '+ JSON.stringify(response));
		}
});
	
}
