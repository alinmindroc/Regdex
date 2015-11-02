var redis = require('redis'),
		client = redis.createClient();

var rl = require('readline').createInterface({
	input: require('fs').createReadStream('words.txt')
});

var i = 0
rl.on('line', function (line) {
	client.set(line, "");
	i++;
	if(i%10000 == 0){
		console.log(line);
	}
});
