(function() {
  function RoomService ($firebaseArray, $firebaseObject, UserDataService) {
    let Rooms = {};
    const ref = firebase.database().ref('rooms'),
          publicRef = ref.child('public'),
          privateRef = ref.child('private'),
          membersRef = firebase.database().ref('members'),
          invitationsRef = firebase.database().ref('invitations');
    Rooms.allPublic = $firebaseArray(publicRef);
    Rooms.userRooms = [];

    Rooms.getPrivateRooms = (invitations) => {
      invitations.$loaded().then(() => {
        invitations.forEach((item) => {
          Rooms.userRooms.push($firebaseObject(privateRef.child(item.$value)));
        });
      }).catch((error) => console.log(error));
    };

    Rooms.getUserRooms = (userSettings) => {
      userSettings.$loaded().then(() => {
        if (userSettings.my_rooms) {
          userSettings.my_rooms.forEach((item) => {
            let id = item.$value,
                room = Rooms[item];
            if (!room) {
              room = $firebaseObject(privateRef.child(item)) || $firebaseObject(publicRef.$getRecord(item));
            }
            room.removeAllowed = true;
            Rooms.userRooms.push(room);
          });
        }
      }).catch((error) => console.log(error));
    };

    Rooms.add = function (event, item, userSettings) {
      if (item.public) {
        Rooms.allPublic.$add(item).then((ref) => {
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
        if (!invitations.includes(userSettings.$id)) invitations.push(userSettings.$id);
        const roomId = privateRef.push().key,
              roomLocation = `/rooms/private/${roomId}`,
              roomInfo = { name: item.name || 'New Room', description: item.description || '' },
              updates = {};
        userSettings.my_rooms.push(roomId);
        userSettings.$save();
        updates[roomLocation] = roomInfo;
        firebase.database().ref().update(updates);
        Rooms.userRooms.push($firebaseObject(firebase.database().ref(roomLocation)));
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
      if (!this[id]) {
        this[id] = Rooms.public.$getRecord(id) || $firebaseObject(privateRef.child(id));
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
