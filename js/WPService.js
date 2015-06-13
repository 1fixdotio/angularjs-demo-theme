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
		return $http.get('wp-json/posts/?page=' + page).success(function(res, status, headers){
			page = parseInt(page);

			if ( isNaN(page) || page > headers('X-WP-TotalPages') ) {
				_updateTitle('Page Not Found', 'Page Not Found');
			} else {
				if (page>1) {
					_updateTitle('Posts on Page ' + page, 'Posts on Page ' + page + ':');
				} else {
					_updateTitle('Home', 'Latest Posts:');
				}

				WPService.posts = res;
				WPService.currentPage = page;
				WPService.totalPages = headers('X-WP-TotalPages');
			}
		});
	};

	return WPService;
}

app.factory('WPService', ['$http', WPService]);