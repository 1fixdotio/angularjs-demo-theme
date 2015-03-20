var app = angular.module('app', ['ngRoute', 'ngSanitize', 'slick']);

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
	.when('/category/:category', {
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

	$http.get('wp-json/media?filter[post_parent]=' + $routeParams.ID).success(function(res){
		if ( res.length > 1 ) {
			$scope.media = res;
		}
	});
}]);

//Category controller
app.controller('Category', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
	$http.get('wp-json/taxonomies/category/terms').success(function(res){
		$scope.categories = res;
	});

	$http.get('wp-json/taxonomies/category/terms/' + $routeParams.category).success(function(res){
		$scope.current_category_id = $routeParams.category;
		$scope.pageTitle = 'Posts in ' + res.name + ':';
		document.querySelector('title').innerHTML = 'Category: ' + res.name + ' | AngularJS Demo Theme';

		$http.get('wp-json/posts/?filter[category_name]=' + res.name).success(function(res){
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