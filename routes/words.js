var express = require('express');
var router = express.Router();


String.prototype.replaceAt=function(index, character) {
  return this.substr(0, index) + character + this.substr(index+character.length);
}

function replaceDiacritics(string){
  var convMap = {
    'ă' : 'a',
    'â' : 'a',
    'î' : 'i',
    'ş' : 's',
    'ș' : 's',
    'ț' : 't', 
    'ţ' : 't' 
  };
  for (var i = 0; i < string.length; i++) {
    if(string[i] in convMap) {    
      string = string.replaceAt(i, convMap[string[i]]);      
    }
  } 
  return string;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  possibleLetters = replaceDiacritics(req.query['possibleLetters'].toLowerCase());

  lettersRegex = '[' + possibleLetters + ']';

  wordLength = parseInt(req.query['length']);
  redisQuery = new Array(wordLength);

  for(var i=0; i<redisQuery.length; i++){
    redisQuery[i] = lettersRegex;
  }

  for(var key in req.query){
    if(key != 'length' && key != 'possibleLetters'){
      redisQuery[parseInt(key.substring(1))] = replaceDiacritics(req.query[key].toLowerCase());
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
