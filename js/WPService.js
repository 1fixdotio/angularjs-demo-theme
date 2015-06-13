function WPService($http) {

	var WPService = {
		categories: [],
		posts: [],
		pageTitle: 'Latest Posts:',
		currentPage: 1,
		totalPages: 1
	};

	function _updateTitle(documentTitle, pageTitle) {
		document.querySelector('title').innerHTML = documentTitle + ' | AngularJS Demo Theme';
		WPService.pageTitle = pageTitle;
	}

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
			_updateTitle('Home', 'Latest Posts:');

			WPService.posts = res;
			WPService.currentPage = page;
			WPService.totalPages = headers('X-WP-TotalPages');
		});
	};

	return WPService;
}

app.factory('WPService', ['$http', WPService]);