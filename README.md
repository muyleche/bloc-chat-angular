## ChatterBox

ChatterBox is a reddit-styled forum web application where people can create places to discuss any topic of their choosing. Though simple on the surface, it hides a complex set of Angular services that connect to a Google Firebase back-end to provide robust functionality and secures information using Firebase's access rules.

![Landing page](https://tboddyspargo.github.io/img/chatterbox_landing2.png)

## Firebase

The Firebase API provides access to a JSON-type database. It's a fairly simple tool for organizing datasets, but its really the API framework, two- and three-way data binding, and feature set that makes it so powerful.

The hierarchical data organization of Firebase is quite different from relational strategies of other database back-ends, but it's approachable and can be 'tuned' to meet a wide variety of needs. [Firebase documentation](https://firebase.google.com/docs/) recommends having a ['flat' structure](https://firebase.google.com/docs/database/web/structure-data#flatten_data_structures) so as to avoid fetching large amounts of data unnecessarily. If all you want to do is list the chatrooms, you would want to avoid retrieving ALL of the messages for every room too. Separating 'messages' and 'rooms' into their own areas of the JSON structure avoids this and is what Firebase calls 'flat'.

![Home page](https://tboddyspargo.github.io/img/chatterbox_home1.png)

ChatterBox organizes the data for the application into the following areas of the JSON :

| Item | Organized by | Description |
|------|--------------|-------------|
|rooms > private|room_id, > room_id|stores private room info (name, description, author, last message)|
|rooms > public|room_id|stores public room info (name, description, author, last message)|
|members|room_id > user_id|stores info about which users elect to join rooms|
|invitations|user_id > room_id|stores info about which private rooms users have been invited to|
|messages|room_id|stores the messages for each room|
|users|user_id|stores public-facing info about all users (name, email, avatar)|
|settings|user_id|stores private information about each user (rooms they created, favorited rooms, etc)|

# Angular

This web application is built on the AngularJS framework and uses `locationProvider`, `stateProvider`, and `urlRouterProvider` to handle routing, templating, and the basic SPA navigation functionality. All the other parts of the application make use of custom services, controllers, and directives to allow the user to interact with the data according to the traditional VMC paradigm.

![Room page](https://tboddyspargo.github.io/img/chatterbox_room1.png)

## Services
| Service | Attributes & Methods | Description |
|---------|----------------------|-------------|
|UserService|signUp()<br/>logIn()<br/>updateProfile()<br/>updatePassword()<br/>logOut()<br/>toggleFavorite()|handles the authentication functionality of the web application, allowing users to sign up, log in/out, and update their account settings (name, email, password, etc.)|
|UserDataService|init()<br/>waitForAllUsers()<br/>getUserIdFromEmail<br/>set()<br/>get()<br/>save()<br/>reset()|handles retrieving/updating public user information so that names/emails/pics accurately reflect each users' account settings when displaying their posts|
|RoomService|init()<br/>getPrivateRooms()<br/>getUserRooms()<br/>add()<br/>updateLastMessage()<br/>remove()<br/>get()<br/>reset()|handles interactions with rooms|
|MessageService|add()<br/>get()<br/>reset()|handles interactions with messages|

## Controllers and Directives
The controllers and directives in ChatterBox mostly just expose functions from the services that are relevant to each part of the view. The directives also help break apart the HTML into semantic elements that accurately describe the content they represent.

* Controllers
  * chatRoomCtrl
  * roomFormCtrl
  * loginFormCtrl
  * homeCtrl
  * navbarCtrl
  * sidebarCtrl
  * userProfileCtrl
* Directives (have controllers)
  * navbar
  * sidebar
* Views (have controllers)
  * Home
  * Room
  * Profile

![Profile page](https://tboddyspargo.github.io/img/chatterbox_account1.png)

# Run the Application

Run the application using the Gruntfile's `default` task:

```
$ npm start
```
