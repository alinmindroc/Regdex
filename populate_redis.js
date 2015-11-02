var fs = require('fs');
var text = fs.readFileSync('words.txt','utf8');
var words = text.split('\r\n');

var regexString = "[camion][camion][camion][camion][camion]n"
regexString = "^" + regexString + "$"

var patt = new RegExp(regexString);

var filtered = words.filter(function(item){
	return patt.test(item);
});

console.log(filtered.slice(1, 20));
console.log(words.slice(1, 20));

console.log(words.length);
console.log(filtered.length);

"92417 10"
"96609 11"
"87040 12"
"70014 13"
"48792 14"
"31422 15"
"18338 16"
"119 3"
"794 4"
"3247 5"
"11062 6"
"26306 7"
"50110 8"
"74497 9"
