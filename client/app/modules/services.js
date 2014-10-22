//create module and configure all the services of the application
(function() {
angular.module('waddle.services', ['waddle.services.auth', 'waddle.services.mapFactory', 'waddle.services.userRequestsFactory', 'waddle.services.footprintRequestsFactory', 'waddle.services.socket']);
})();
