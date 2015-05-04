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
		templateUrl: myLocalized.partials + '404.html',
		controller: '404'
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

		$scope.currentPage = 1;
		$scope.totalPages = headers('X-WP-TotalPages');
	});
}]);

//Content controller
app.controller('Content', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
	$http.get('wp-json/posts/' + $routeParams.ID).success(function(res){
		$scope.post = res;
		document.querySelector('title').innerHTML = res.title + ' | AngularJS Demo Theme';
	}).error(function(res, status){
		if (status === 404) {
			$scope.is404 = true;
			document.querySelector('title').innerHTML = 'Page not found | AngularJS Demo Theme';
			$scope.errorMessage = 'Error: ' + res[0].message;
		}
	});

	$http.get('wp-json/media?filter[post_parent]=' + $routeParams.ID + '&filter[posts_per_page]=-1').success(function(res){
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

	$http.get('wp-json/taxonomies/category/terms/?filter[slug]=' + $routeParams.category).success(function(res){
		if (!res.length) {
			document.querySelector('title').innerHTML = 'Category not found | AngularJS Demo Theme';
			$scope.pageTitle = 'Category not found';
		} else {
			$scope.current_category_id = res[0].ID;
			var currentPage = ( ! $routeParams.page ) ? 1 : parseInt( $routeParams.page );
			$scope.pageTitle = 'Posts in ' + res[0].name + ' Page ' + currentPage + ':';
			document.querySelector('title').innerHTML = 'Category: ' + res[0].name + ' | AngularJS Demo Theme';

			var request = 'wp-json/posts/?filter[category_name]=' + res[0].name;
			if ( $routeParams.page ) {
				request += '&page=' + currentPage;
			}
			$http.get(request).success(function(res, status, headers){
				if ( $routeParams.page && ( isNaN(currentPage) || currentPage > headers('X-WP-TotalPages') ) ) {
					document.querySelector('title').innerHTML = 'Page not found | AngularJS Demo Theme';
					$scope.pageTitle = 'Page not found';
				} else {
					$scope.posts = res;

					$scope.currentPage = currentPage;
					$scope.totalPages = headers('X-WP-TotalPages');
				}
			});
		}
	});
}]);

//Paged controller
app.controller('Paged', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
	$http.get('wp-json/taxonomies/category/terms').success(function(res){
		$scope.categories = res;
	});

	$http.get('wp-json/posts/?page=' + $routeParams.page).success(function(res, status, headers){
		var currentPage = parseInt($routeParams.page);

		if ( isNaN(currentPage) || currentPage > headers('X-WP-TotalPages') ) {
			document.querySelector('title').innerHTML = 'Page not found | AngularJS Demo Theme';
			$scope.pageTitle = 'Page not found';
		} else {
			$scope.currentPage = currentPage;
			$scope.totalPages = headers('X-WP-TotalPages');

			$scope.posts = res;
			$scope.pageTitle = 'Posts on Page ' + $scope.currentPage + ':';
			document.querySelector('title').innerHTML = 'Page ' + $scope.currentPage + ' | AngularJS Demo Theme';
		}
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
				$http.get('wp-json/posts/?filter[s]=' + $scope.filter.s + '&filter[posts_per_page]=-1').success(function(res){
					$scope.posts = res;
					$scope.pageTitle = 'Search Results:';

					$scope.currentPage = 1;
					$scope.totalPages = 1;
				});
			};
		}]
	};
});

//404 controller
app.controller('404', function() {
	document.querySelector('title').innerHTML = 'Page not found | AngularJS Demo Theme';
});

//postsNavLink Directive
app.directive('postsNavLink', function() {
	return {
		restrict: 'EA',
		templateUrl: myLocalized.partials + 'posts-nav-link.html',
		controller: ['$scope', '$element', '$routeParams', function( $scope, $element, $routeParams ){
			var currentPage = ( ! $routeParams.page ) ? 1 : parseInt( $routeParams.page ),
			linkPrefix = ( ! $routeParams.category ) ? 'page/' : 'category/' + $routeParams.category + '/page/';

			$scope.postsNavLink = {
				prevLink: linkPrefix + ( currentPage - 1 ),
				nextLink: linkPrefix + ( currentPage + 1 ),
				sep: ( ! $element.attr('sep') ) ? '|' : $element.attr('sep'),
				prevLabel: ( ! $element.attr('prev-label') ) ? 'Previous Page' : $element.attr('prev-label'),
				nextLabel: ( ! $element.attr('next-label') ) ? 'Next Page' : $element.attr('next-label')
			};
		}]
	};
});