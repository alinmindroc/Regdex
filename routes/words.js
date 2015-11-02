var express = require('express');
var router = express.Router();

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

  var fs = require('fs'); 
  var text = fs.readFileSync('words.txt','utf8'); 
  var words = text.split('\r\n'); 

  var regexString = redisQuery; 
  regexString = "^" + regexString + "$" 

  var patt = new RegExp(regexString); 

  var filtered = words.filter(function(item){ 
    return patt.test(item); 
  }); 

  res.send(filtered);
});

module.exports = router;
