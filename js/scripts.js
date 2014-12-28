angular.module('app', ['ngRoute', 'ngSanitize'])
.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$routeProvider
	.when('/', {
		templateUrl: myLocalized.partials + 'main.html',
		controller: 'Main'
	})
	.when('/demo', {
		templateUrl: myLocalized.partials + 'demo.html',
		controller: 'Main'
	})
	.when('/:ID', {
		templateUrl: myLocalized.partials + 'content.html',
		controller: 'Content'
	});
})
.controller('Main', function($scope, $http, $routeParams) {
	$scope.filter = {
		s: ''
	};

	$http.get('wp-json/posts/').success(function(res){
		$scope.posts = res;
	});

	$scope.search = function() {
		$http.get('wp-json/posts/?filter[s]=' + $scope.filter.s).success(function(res){
			$scope.posts = res;
		});
	};
})
.controller('Content', function($scope, $http, $routeParams) {
	$http.get('wp-json/posts/' + $routeParams.ID).success(function(res){
		$scope.post = res;
	});
})
.directive('searchForm', function() {
	return {
		restrict: 'EA',
		templateUrl: myLocalized.partials + 'search-form.html',
	};
});