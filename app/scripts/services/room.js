(function() {
  function RoomService ($firebaseArray, $firebaseObject, UserDataService) {
    let Rooms = {};
    const ref = firebase.database().ref('rooms'),
          publicRef = ref.child('public'),
          privateRef = ref.child('private'),
          membersRef = firebase.database().ref('members'),
          invitationsRef = firebase.database().ref('invitations');
    Rooms.public = $firebaseArray(publicRef);
    Rooms.private = [];

    Rooms.getPrivateRooms = (userSettings, roomId) => {
      userSettings.$loaded().then(() => {
        userSettings.my_private_rooms.forEach((item) => {
          Rooms.private.push($firebaseObject(privateRef.child(item)));
        });
      });
    };

    Rooms.add = function (event, item, uid) {
      if (item.public) {
        Rooms.public.$add(item).then((ref) => {
          console.log("added record with id " + ref.key);
          event.target.closest('form').reset();
        });
      }
      else {
        let invitations = item.invitations.split(/[,\n]/g)
          .reduce((users, val) => {
            const id = UserDataService.getUserIdFromEmail(val);
            if (id) users.push(id);
            return users;
          }, []);
        if (!invitations.includes(uid)) invitations.push(uid);

        const roomId = privateRef.push().key,
              roomLocation = `/rooms/private/${roomId}`,
              roomInfo = { name: item.name || 'New Room', description: item.description || '' },
              updates = {};
        updates[roomLocation] = roomInfo;
        firebase.database().ref().update(updates);
        Rooms.private.push($firebaseObject(firebase.database().ref(roomLocation)));
      }
      event.target.closest('form').reset();
    };
    Rooms.updateLastMessage = function (room, message) {
      room.lastMessage = message;
      room.$save().then((ref) => {
        console.log("saved record with id " + ref.key);
      });
    };
    Rooms.remove = function (item) {
      rooms.$remove(item).then((ref) => {
        console.log("removed record with id " + ref.key);
      });
    };
    Rooms.get = function (id, priv) {
      console.log(id,priv);
      if (!this[id]) {
        this[id] = priv ? $firebaseObject(privateRef.child(id))
                        : $firebaseObject(Rooms.public[id]);
      }
      return this[id];
    };
    Rooms.joinRoom = function (userId, roomId) {
      let memberObject = $firebaseObject(membersRef.child(roomId+'/'+userId));
      memberObject.$loaded().then(function() {
        Rooms[roomId] = $firebaseObject(privateRef.child(roomId));
        console.log(Rooms[roomId]);
      });
    };
    return Rooms;
  }

  angular
    .module('chatterBox')
    .factory('RoomService', ['$firebaseArray', '$firebaseObject', 'UserDataService', RoomService]);
})();
