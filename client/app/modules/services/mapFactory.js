angular.module('waddle.services.mapFactory', [])

.factory('FacebookMapData', function($q){
  
	var getFacebookMapData = function(){
		var deferred = $q.defer();
		openFB.api({
      path: '/me/tagged_places',
      params: {redirect:false},
      success: function(data) {
        console.log(data);
        deferred.resolve(data);
      },
      error: function(err) {console.log(err);}
    });
    return deferred.promise;
	}

	return {
		getFacebookMapData: getFacebookMapData
	};
});