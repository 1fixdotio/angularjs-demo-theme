var app = angular.module('app', ['ngRoute', 'ngSanitize']);

//Config the route
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
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
	.when('/blog/:ID', {
		templateUrl: myLocalized.partials + 'content.html',
		controller: 'Content'
	})
	.when('/blog/category/:category', {
		templateUrl: myLocalized.partials + 'main.html',
		controller: 'Category'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

//Main controller
app.controller('Main', ['$scope', '$http', function($scope, $http) {
	$http.get('wp-json/taxonomies/category/terms').success(function(res){
		$scope.categories = res;
	});

	$http.get('wp-json/posts/').success(function(res){
		$scope.posts = res;
		$scope.pageTitle = 'Latest Posts:';
		document.querySelector('title').innerHTML = 'Home | AngularJS Demo Theme';
	});
}]);

//Content controller
app.controller('Content', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
	$http.get('wp-json/posts/' + $routeParams.ID).success(function(res){
		$scope.post = res;
		document.querySelector('title').innerHTML = res.title + ' | AngularJS Demo Theme';
	});
}]);

//Category controller
app.controller('Category', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
	$http.get('wp-json/taxonomies/category/terms').success(function(res){
		$scope.categories = res;
	});

	$http.get('wp-json/taxonomies/category/terms/?filter[slug]=' + $routeParams.category).success(function(res){
		$scope.current_category_id = res[0].ID;
		$scope.pageTitle = 'Posts in ' + res[0].name + ':';
		document.querySelector('title').innerHTML = 'Category: ' + res[0].name + ' | AngularJS Demo Theme';

		$http.get('wp-json/posts/?filter[category_name]=' + res[0].name).success(function(res){
			$scope.posts = res;
		});
	});
}]);

//searchForm Directive
app.directive('searchForm', function() {
	return {
		restrict: 'EA',
		template: 'Search Keyword: <input type="text" name="s" ng-model="filter.s" ng-change="search()">',
		controller: ['$scope', '$http', function ( $scope, $http ) {
			$scope.filter = {
				s: ''
			};
			$scope.search = function() {
				$http.get('wp-json/posts/?filter[s]=' + $scope.filter.s).success(function(res){
					$scope.posts = res;
				});
			};
		}]
	};
});