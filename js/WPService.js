function WPService($http) {

	var WPService = {
		categories: []
	};

	WPService.getAllCategories = function() {
		if (WPService.categories.length) {
			return;
		}

		return $http.get('wp-json/taxonomies/category/terms').success(function(res){
			WPService.categories = res;
		});
	};

	return WPService;
}

app.factory('WPService', ['$http', WPService]);