angular.module('waddle.services.mapFactory', [])

.factory('FacebookMapData', function($q){
  
	var getFacebookMapData = function(){
		var deferred = $q.defer();

		openFB.api({
      path: '/me/tagged_places',
      params: {
        redirect:false
      },
      success: deferred.resolve,
      error: deferred.reject
    });

    return deferred.promise;
	}

	return {
		getFacebookMapData: getFacebookMapData
	};
});