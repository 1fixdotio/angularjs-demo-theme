var app = angular.module('app', ['ngRoute', 'ngSanitize']);

//Config the route
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$routeProvider
	.when('/', {
		templateUrl: myLocalized.partials + 'main.html',
		controller: 'Main',
		title: 'Home'
	})
	.when('/demo', {
		templateUrl: myLocalized.partials + 'demo.html',
		controller: 'Main',
		title: 'Demo'
	})
	.when('/blog/:ID', {
		templateUrl: myLocalized.partials + 'content.html',
		controller: 'Content',
		title: ''
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

// change Page Title based on the routers
app.run(['$rootScope', '$http', '$sce', function($rootScope, $http, $sce) {
	$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
		if ( current.$$route.title !== '' ) {
			document.querySelector('title').innerHTML = $sce.trustAsHtml(current.$$route.title + ' | AngularJS Demo Theme');
		}
	});
}]);

//Main controller
app.controller('Main', ['$scope', '$http', function($scope, $http) {
	$http.get('wp-json/posts/').success(function(res){
		$scope.posts = res;
	});
}]);

//Content controller
app.controller('Content', ['$scope', '$routeParams', '$http', '$sce', function($scope, $routeParams, $http, $sce) {
	$http.get('wp-json/posts/' + $routeParams.ID).success(function(res){
		$scope.post = res;
		document.querySelector('title').innerHTML = $sce.trustAsHtml(res.title + ' | AngularJS Demo Theme');
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