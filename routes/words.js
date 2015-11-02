var express = require('express');
var router = express.Router();

var redis = require('redis'),
	client = redis.createClient();

/* GET users listing. */
router.get('/', function(req, res, next) {
  possibleLetters = req.query['possibleLetters'];

  lettersRegex = '[' + possibleLetters + ']';

  wordLength = parseInt(req.query['length']);
  redisQuery = new Array(wordLength);

  for(var i=0; i<redisQuery.length; i++){
    redisQuery[i] = lettersRegex;
  }

  for(var key in req.query){
    if(key != 'length' && key != 'possibleLetters'){
      redisQuery[parseInt(key.substring(1))] = req.query[key];
    }
  }

  redisQuery = redisQuery.join('');

  console.log(redisQuery);

  client.keys(redisQuery, function(err, replies){
    res.send(replies);
  });
});

module.exports = router;
