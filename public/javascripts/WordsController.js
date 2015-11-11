angular.module('app', ['ngRoute', 'ngResource'])
.controller('WordsController', ['$scope', '$resource', function($scope, $resource){
	$scope.wordLength = 5;
	$scope.maxWordLength = 16;
	$scope.knownLetters = new Array($scope.maxWordLength);
	$scope.possibleLetters = "";

	$scope.range = function(len){
		return new Array(len);
	}

	$scope.makeRequest = function(){
		$scope.finishedRequest = true;
		params = {};

		for(var i in $scope.knownLetters){
			if($scope.knownLetters[i].length > 0)
				params['l' + i] = $scope.knownLetters[i];
		}

		params['length'] = $scope.wordLength;
		params['possibleLetters'] = $scope.possibleLetters;

		var resource = $resource('/words', {});
		var wordsResult = resource.query(params, function(){
			$scope.result = wordsResult;
			$scope.finishedRequest = true;
		});
	}
}])
.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: '/templates/words.html',
		controller: 'WordsController'
	});
}]);