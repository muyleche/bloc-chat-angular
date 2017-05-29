(function() {
  class RoomService {
    constructor($firebaseArray) {
      const ref = firebase.database().ref().child('rooms'),
            rooms = $firebaseArray(ref);
      this.all = rooms;
    }
  }

  angular
    .module('chatterBox')
    .factory('RoomService', RoomService);
})();
