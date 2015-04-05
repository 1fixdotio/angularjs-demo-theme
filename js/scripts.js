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
	.when('/category/:category/', {
		templateUrl: myLocalized.partials + 'main.html',
		controller: 'Category'
	})
	.when('/category/:category/page/:page', {
		templateUrl: myLocalized.partials + 'main.html',
		controller: 'Category'
	})
	.when('/page/:page', {
		templateUrl: myLocalized.partials + 'main.html',
		controller: 'Paged'
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

	$http.get('wp-json/posts/').success(function(res, status, headers){
		$scope.posts = res;
		$scope.pageTitle = 'Latest Posts:';
		document.querySelector('title').innerHTML = 'Home | AngularJS Demo Theme';

		$scope.postsNavLink = {
			currentPage: 1,
			totalPages: headers('X-WP-TotalPages'),
			nextLink: 'page/2'
		};
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
		var currentPage = ( ! $routeParams.page ) ? 1 : parseInt( $routeParams.page );
		$scope.pageTitle = 'Posts in ' + res.name + ' Page ' + currentPage + ':';
		document.querySelector('title').innerHTML = 'Category: ' + res.name + ' | AngularJS Demo Theme';

		var request = 'wp-json/posts/?filter[category_name]=' + res.name;
		if ( $routeParams.page ) {
			request += '&page=' + $routeParams.page;
		}
		$http.get(request).success(function(res, status, headers){
			$scope.posts = res;

			$scope.postsNavLink = {
				currentPage: currentPage,
				totalPages: headers('X-WP-TotalPages'),
				prevLink: 'category/' + $routeParams.category + '/page/' + ( currentPage - 1 ),
				nextLink: 'category/' + $routeParams.category + '/page/' + ( currentPage + 1 )
			};
		});
	});
}]);

//Paged controller
app.controller('Paged', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
	$http.get('wp-json/taxonomies/category/terms').success(function(res){
		$scope.categories = res;
	});

	$http.get('wp-json/posts/?page=' + $routeParams.page).success(function(res, status, headers){
		var currentPage = parseInt($routeParams.page);
		$scope.postsNavLink = {
			currentPage: currentPage,
			totalPages: headers('X-WP-TotalPages'),
			prevLink: 'page/' + ( currentPage - 1 ),
			nextLink: 'page/' + ( currentPage + 1 )
		};

		$scope.posts = res;
		$scope.pageTitle = 'Posts on Page ' + $scope.currentPage + ':';
		document.querySelector('title').innerHTML = 'Page ' + $scope.currentPage + ' | AngularJS Demo Theme';
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

//postsNavLink Directive
app.directive('postsNavLink', function() {
	return {
		restrict: 'EA',
		templateUrl: myLocalized.partials + 'posts-nav-link.html',
		controller: ['$scope', '$element', function( $scope, $element ){
			$scope.prevLabel = ( ! $element.attr('prev-label') ) ? 'Previous Page' : $element.attr('prev-label');
			$scope.nextLabel = ( ! $element.attr('next-label') ) ? 'Next Page' : $element.attr('next-label');
		}]
	};
});