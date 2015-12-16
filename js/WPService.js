function WPService($http) {

	var WPService = {
		categories: [],
		posts: [],
		pageTitle: 'Latest Posts:',
		currentPage: 1,
		totalPages: 1,
		currentUser: {}
	};

	function _updateTitle(documentTitle, pageTitle) {
		document.querySelector('title').innerHTML = documentTitle + ' | AngularJS Demo Theme';
		WPService.pageTitle = pageTitle;
	}

	function _setArchivePage(posts, page, headers) {
		WPService.posts = posts;
		WPService.currentPage = page;
		WPService.totalPages = headers('X-WP-TotalPages');
	}

	WPService.getAllCategories = function() {
		if (WPService.categories.length) {
			return;
		}

		return $http.get('wp-json/wp/v2/categories').success(function(res){
			WPService.categories = res;
		});
	};

	WPService.getPosts = function(page) {
		return $http.get('wp-json/wp/v2/posts/?page=' + page + '&filter[posts_per_page]=1').success(function(res, status, headers){
			page = parseInt(page);

			if ( isNaN(page) || page > headers('X-WP-TotalPages') ) {
				_updateTitle('Page Not Found', 'Page Not Found');
			} else {
				if (page>1) {
					_updateTitle('Posts on Page ' + page, 'Posts on Page ' + page + ':');
				} else {
					_updateTitle('Home', 'Latest Posts:');
				}

				_setArchivePage(res,page,headers);
			}
		});
	};

	WPService.getSearchResults = function(s) {
		return $http.get('wp-json/wp/v2/posts/?filter[s]=' + s + '&filter[posts_per_page]=-1').success(function(res, status, headers){
			_updateTitle('Search Results for ' + s, 'Search Results:');

			_setArchivePage(res,1,headers);
		});
	};

	WPService.getPostsInCategory = function(category, page) {
		page = ( ! page ) ? 1 : parseInt( page );
		_updateTitle('Category: ' + category.name, 'Posts in ' + category.name + ' Page ' + page + ':');

		var request = 'wp-json/wp/v2/posts/?filter[category_name]=' + category.name + '&filter[posts_per_page]=1';
		if ( page ) {
			request += '&page=' + page;
		}

		return $http.get(request).success(function(res, status, headers){
			_setArchivePage(res, page, headers);
		});
	};

	WPService.getCurrentUser = function() {
		return $http.get('wp-json/wp/v2/users/me').success(function(res){
			WPService.currentUser = res;
		});
	};

	return WPService;
}

app.factory('WPService', ['$http', WPService]);