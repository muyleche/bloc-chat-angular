(function() {
  function RoomService ($firebaseArray, $firebaseObject, UserDataService) {
    let Rooms = {};
    const ref = firebase.database().ref('rooms'),
          publicRef = ref.child('public'),
          privateRef = ref.child('private'),
          membersRef = firebase.database().ref('members'),
          invitationsRef = firebase.database().ref('invitations');

    this.userRooms = [];

    /**
     * @function Initialize the public and private room lists.
     */
    Rooms.init = function () {
      this.allPublic = this.allPublic || $firebaseArray(publicRef);
      this.userRooms = this.userRooms || [];
    };

    /**
     * @function Retrieves the private rooms to which the currently logged-in user has access.
     * @param  {$firebaseObject} invitations The currently logged-in user's invitations.
     */
    Rooms.getPrivateRooms = function (invitations) {
      invitations.$loaded().then(() => {
        invitations.forEach((item, index) => {
          this.get(index);
        });
      }).catch((error) => console.log(error));
    };

    /**
     * @function Get the rooms this user created.
     * @param  {$firebaseObject} userSettings The currently logged in user's settings.
     */
    Rooms.getUserRooms = function (userSettings) {
      userSettings.$loaded().then(() => {
        for (let item in userSettings.my_rooms) {
          this.get(item);
        }
      }).catch((error) => console.log(error));
    };

    /**
     * @function Add a new room object.
     * @param  {JavaScriptEventObject} event DOM event if this function was triggered from the DOM.
     * @param  {room} room    The room data to save.
     * @param  {$firebaseObject} userSettings The currently logged in user's settings.
     */
    Rooms.add = function (event, room, userSettings) {
      let roomId, roomInfo, roomLocation, updates = {};
      room.name = room.name || 'New Room';
      room.description = room.description || "";
      room.public = !!room.public
      if (room.public) {
        roomId = publicRef.push().key;
        roomLocation = `/rooms/public/${roomId}`;
      }
      else {
        roomId = privateRef.push().key;
        room.invitations.split(/[,\n]/g).map((val) => {
            const id = UserDataService.getUserIdFromEmail(val);
            if (id) updates[`/invitations/${id}/${roomId}`] = "";
          });
        roomLocation = `/rooms/private/${roomId}`;
      }
      // update room and members/invitations.
      updates[roomLocation] = { name: room.name, description: room.description, public: room.public };
      firebase.database().ref().update(updates);

      // add room to user's room list.
      if (!userSettings.my_rooms) userSettings.my_rooms = {};
      userSettings.my_rooms[roomId] = "";
      userSettings.$save();
      this.userRooms.push($firebaseObject(firebase.database().ref(roomLocation)));

      console.log("Added record with id", roomId);
      if (event) event.target.closest('form').reset();
    };

    /**
     * @function Sets the 'lastMessage' property on a room object.
     * @param  {$firebaseObject} room    The room object to update.
     * @param  {object} message The message object.
     */
    Rooms.updateLastMessage = function (room, message, rooms) {
      room.lastMessage = message;
      console.log(room, message, rooms);
      if (room.$save) {
        room.$save().then((ref) => {
          console.log("Saved record with id", ref.key);
        });
      }
      else if (this.allPublic) {
        this.allPublic.$save(room);
      }
    };

    /**
     * @function Deletes the chatroom entry in the firebase array and relevant local arrays.
     * @param  {$firebaseObject} room The room to delete.
     */
    Rooms.remove = function (room) {
      let removal;
      if (room instanceof $firebaseObject) {
        removal = room.$remove();
      }
      else if (room) {
        removal = Rooms.allPublic.$remove(room);
      }

      if (removal) {
        removal.then((ref) => {
          if (this.userRooms.includes(room)) this.userRooms.splice(this.userRooms.indexOf(room),1);
          console.log("removed record with id", ref.key);
        });
      }
      else console.log("This room was not of a recognized type", room);
    };

    /**
     * @function Retrieve a firebase object (or object from a firebase array) representing the chatroom with the provided id.
     * @param  {Number} id The id number of the chatroom.
     */
    Rooms.get = function (id) {
      let room = null;
      if (!this.userRooms || !this.allPublic) return;
      // existing room.
      for (room of this.userRooms) {
        if (room.$id === id) return room;
      }

      // existing public room.
      room = this.allPublic.$getRecord(id);

      // new private room.
      room = room || $firebaseObject(privateRef.child(id));
      if (room instanceof $firebaseObject) {
        room.$loaded().then((data) => {
          let index = -1, i;
          for (i = 0; i < this.userRooms.length; i++) {
            if (this.userRooms[i].$id === data.$id) index = i;
          }
          if (data.$value == null && data.name == null) {
            if (index >= 0) this.userRooms.splice(index,1);
            data.$destroy();
          }
          else if (index < 0) this.userRooms.push(data);
        });
      }

      return room;
    };

    /**
     * @function Empty the room arrays, both public and private.
     */
    Rooms.reset = function () {
      for (let room, i = 0; i < this.userRooms.length; i++) {
        room = this.userRooms.shift();
        room.$destroy();
        i--;
      }
      this.allPublic.$destroy();
      this.allPublic = null;
    };

    return Rooms;
  }

  angular
    .module('chatterBox')
    .factory('RoomService', ['$firebaseArray', '$firebaseObject', 'UserDataService', RoomService]);
})();
