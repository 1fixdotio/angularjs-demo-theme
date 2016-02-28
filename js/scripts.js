var app = angular.module('app', ['ngRoute', 'ngSanitize', 'slick']);

//Config the route
app.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
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
		.when('/category/:slug/', {
			templateUrl: myLocalized.partials + 'main.html',
			controller: 'Category'
		})
		.when('/category/:slug/page/:page', {
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

	$httpProvider.interceptors.push([function() {
		return {
			'request': function(config) {
				config.headers = config.headers || {};
				//add nonce to avoid CSRF issues
				config.headers['X-WP-Nonce'] = myLocalized.nonce;

				return config;
			}
		};
	}]);
}]);

//Main controller
app.controller('Main', ['$scope', 'WPService', function($scope, WPService) {
	WPService.getAllCategories();
	WPService.getPosts(1);
	$scope.data = WPService;
}]);

//Content controller
app.controller('Content', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
	$http.get('wp-json/wp/v2/posts/' + $routeParams.ID).success(function(res) {
		$scope.post = res;
		document.querySelector('title').innerHTML = res.title.rendered + ' | AngularJS Demo Theme';
	}).error(function(res, status) {
		if (status === 404) {
			$scope.is404 = true;
			document.querySelector('title').innerHTML = 'Page not found | AngularJS Demo Theme';
			$scope.errorMessage = 'Error: ' + res[0].message;
		}
	});

	$http.get('wp-json/wp/v2/media?filter[post_parent]=' + $routeParams.ID + '&filter[posts_per_page]=-1').success(function(res) {
		if (res.length > 1) {
			$scope.media = res;
		}
	});
}]);

//Category controller
app.controller('Category', ['$scope', '$routeParams', '$http', 'WPService', function($scope, $routeParams, $http, WPService) {
	WPService.getAllCategories();
	$http.get('wp-json/wp/v2/categories/?search=' + $routeParams.slug).success(function(res) {
		if (!res) {
			document.querySelector('title').innerHTML = 'Category not found | AngularJS Demo Theme';
			$scope.data.pageTitle = 'Category not found';
		} else {
			$scope.current_category_id = res[0].id;
			WPService.getPostsInCategory(res[0], $routeParams.page);
		}
	});

	$scope.data = WPService;
}]);

//Paged controller
app.controller('Paged', ['$scope', '$routeParams', 'WPService', function($scope, $routeParams, WPService) {
	WPService.getAllCategories();
	WPService.getPosts($routeParams.page);
	$scope.data = WPService;
}]);

//404 controller
app.controller('404', function() {
	document.querySelector('title').innerHTML = 'Page not found | AngularJS Demo Theme';
});

//searchForm Directive
app.directive('searchForm', function() {
	return {
		restrict: 'EA',
		template: 'Search Keyword: <input type="text" name="s" ng-model="filter.s" ng-change="search()">',
		controller: ['$scope', 'WPService', function($scope, WPService) {
			$scope.filter = {
				s: ''
			};
			$scope.search = function() {
				WPService.getSearchResults($scope.filter.s);
			};
		}]
	};
});

//postsNavLink Directive
app.directive('postsNavLink', function() {
	return {
		restrict: 'EA',
		templateUrl: myLocalized.partials + 'posts-nav-link.html',
		controller: ['$scope', '$element', '$routeParams', function($scope, $element, $routeParams) {
			var currentPage = (!$routeParams.page) ? 1 : parseInt($routeParams.page),
				linkPrefix = (!$routeParams.slug) ? 'page/' : 'category/' + $routeParams.slug + '/page/';

			$scope.postsNavLink = {
				prevLink: linkPrefix + (currentPage - 1),
				nextLink: linkPrefix + (currentPage + 1),
				sep: (!$element.attr('sep')) ? '|' : $element.attr('sep'),
				prevLabel: (!$element.attr('prev-label')) ? 'Previous Page' : $element.attr('prev-label'),
				nextLabel: (!$element.attr('next-label')) ? 'Next Page' : $element.attr('next-label')
			};
		}]
	};
});

//sayHello Directive
app.directive('sayHello', function(){
	return {
		restrict: 'EA',
		templateUrl: myLocalized.partials + 'say-hello.html',
		controller: ['WPService', function(WPService) {
			WPService.getCurrentUser();
		}]
	};
});