function WPService($http) {

	var WPService = {
		categories: [],
		posts: [],
		pageTitle: 'Latest Posts:',
		currentPage: 1,
		totalPages: 1
	};

	WPService.getAllCategories = function() {
		if (WPService.categories.length) {
			return;
		}

		return $http.get('wp-json/taxonomies/category/terms').success(function(res){
			WPService.categories = res;
		});
	};

	WPService.getPosts = function(page) {
		return $http.get('wp-json/posts/').success(function(res, status, headers){
			WPService.posts = res;
			WPService.pageTitle = 'Latest Posts:';
			document.querySelector('title').innerHTML = 'Home | AngularJS Demo Theme';

			WPService.currentPage = page;
			WPService.totalPages = headers('X-WP-TotalPages');
		});
	};

	return WPService;
}

app.factory('WPService', ['$http', WPService]);