angular.module('waddle.services.socket', [])
  .factory('Socket', function (socketFactory) {
  	var Socket = socketFactory();
  	Socket.forward('error');
  	return mySocket;
  });

