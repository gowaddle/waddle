angular.module('waddle.map', [])

  .controller('MapController', function ($scope, $state, Auth, FacebookMapData) {
    $scope.logout = Auth.logout;
  	Auth.checkLogin().then(function(){
	  	$scope.map = L.mapbox.map('map', 'injeyeo2.i9nn801b', {
	      attributionControl: false,
	      zoomControl: false
	    }).setView([37.6, -122.45], 3);
	  });

	  FacebookMapData.getFacebookMapData().then(function(data){
	  	console.log("we got data:", data)
	  })
  })