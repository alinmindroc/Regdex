var express = require('express');
var router = express.Router();

function replaceAt(str, index, character){
  return str.substr(0, index) + character + str.substr(index + character.length);
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
      string = replaceAt(string, i, convMap[string[i]]);      
    }
  } 
  return string;
}

function count(string, char){
  return (string.match(new RegExp(char, "g")) || []).length;
}

function getRegex(queryObject){
  possibleLetters = replaceDiacritics(queryObject['possibleLetters'].toLowerCase());
  wordLength = parseInt(queryObject['length']);

  finalRegex = new Array(wordLength);

  //each letter can take values from the possibleLetters array
  for(var i=0; i<finalRegex.length; i++){
    finalRegex[i] = '[' + possibleLetters + ']';
  }

  //set the known letters in the regex
  for(var key in queryObject){
    if(key != 'length' && key != 'possibleLetters'){
      finalRegex[parseInt(key.substring(1))] = replaceDiacritics(queryObject[key].toLowerCase());
    }
  }

  //create string from character array
  finalRegex = finalRegex.join('');

  //set beginning and final characters
  finalRegex = "^" + finalRegex + "$";

  return new RegExp(finalRegex);
}

/* GET users listing. */
router.get('/', function(req, res, next) {

  var pattern = getRegex(req.query); 

  var filteredWords = wordsArray.filter(function(item){ 
    return pattern.test(item); 
  });

  //check that the filtered words don't contain
  //a letter with an occurence number higher than specified
  letterCount = {};

  for(var i in possibleLetters){
    crtLetter = possibleLetters[i];
    if(crtLetter in letterCount){
      letterCount[crtLetter]++;
    } else {
      letterCount[crtLetter] = 1;
    }
  }

  finalWords = [];

  for(var i in filteredWords){
    word = filteredWords[i];
    check = true;
    for(var l in letterCount){
      nr = letterCount[l];
      if(count(word, l) > nr){
        check = false;
        break;
      }
    }
    if(check)
      finalWords.push(word);
  }

  res.send(finalWords);
});

module.exports = router;
