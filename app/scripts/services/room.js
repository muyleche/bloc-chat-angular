(function() {
  function RoomService ($firebaseArray) {
    let Rooms = {};
    const ref = firebase.database().ref().child('rooms'),
          rooms = $firebaseArray(ref);
    Rooms.all = rooms;

    return Rooms;
  }

  angular
    .module('chatterBox')
    .factory('RoomService', RoomService);
})();
