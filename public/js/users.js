var DrawingBoard = DrawingBoard || {};
DrawingBoard.Users = DrawingBoard.Users || {};

var User = function (userData) {
	this.setAttributes= function (userData) {
		this.name = userData.name;
		this.uid = Math.round((new Date()).getTime() / 1000);
		this.provider = userData.provider;
		this.room = userData.room;
		this.brush = userData.brush;
	}
	this.setAttributes(userData);
}

DrawingBoard.Users.initialize = function (socket, userData) {
	this.socket = socket;
	this.users = {};
	socket.emit('getusers', {});

	socket.on('userlist', function(data) {
		this.users = JSON.parse(data);
	});

	var self = this;
	this.owner = new User(userData);
	console.log(this.owner);

	socket.emit('join', JSON.stringify(this.owner));

	socket.on('adduser', function (user) {
		u = JSON.parse(user);
		console.log(u);
		self.addUser(u);
	});
}

DrawingBoard.Users.getUsers = function () {
	return users;
}

DrawingBoard.Users.getOwnerId = function () {
	return this.owner.uid;
}
DrawingBoard.Users.addUser = function (user) {
	this.users[user.uid] = user;
}

DrawingBoard.Users.displayUsers = function () {
	//loop through users, add each name to dom
}

DrawingBoard.Users.refreshList = function() {
	//repopulate list from server
}

DrawingBoard.Users.removeUsersFromList = function (id) {
	//remove user id from dom
}

DrawingBoard.Users.setBrushData = function (userId, brushData) { 
	this.users[userId].brushInfo = brushData;
}

