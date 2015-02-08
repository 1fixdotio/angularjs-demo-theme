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
app.controller('Main', ['$scope', 'Posts', function($scope, Posts) {
	Posts.get().success(function(res){
		$scope.posts = res;
	});
}]);

//Content controller
app.controller('Content', ['$scope', '$routeParams', 'Posts', '$sce', function($scope, $routeParams, Posts, $sce) {
	Posts.getSingle($routeParams.ID).success(function(res){
		$scope.post = res;
		document.querySelector('title').innerHTML = $sce.trustAsHtml(res.title + ' | AngularJS Demo Theme');
	});
}]);

//searchForm Directive
app.directive('searchForm', ['Posts', function(Posts) {
	return {
		restrict: 'EA',
		template: 'Search Keyword: <input type="text" name="s" ng-model="filter.s" ng-change="search()">',
		controller: ['$scope', function ($scope) {
			$scope.filter = {
				s: ''
			};
			$scope.search = function() {
				var filter = 'filter[s]=' + $scope.filter.s;
				Posts.getByFilter(filter).success(function(res){
					$scope.posts = res;
				});
			};
		}]
	};
}]);

//Posts Service
app.service('Posts', ['$http', function($http){
	this.get = function () {
		return $http.get('wp-json/posts/');
	};

	this.getByFilter = function(filter) {
		return $http.get('wp-json/posts/?'+filter);
	};

	this.getSingle = function(id) {
		return $http.get('wp-json/posts/'+id);
	};
}]);