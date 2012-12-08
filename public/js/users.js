var DrawingBoard = DrawingBoard || {};
DrawingBoard.Users = DrawingBoard.Users || {};

var User = function(userData) {
	this.setAttributes= function(userData) {
		this.name = userData.name;
		this.uid = Math.round((new Date()).getTime() / 1000);
		this.provider = userData.provider;
		this.room = userData.room;
		this.brushData = userData.brushData;
		this.brush = {};
	}
	this.setAttributes(userData);
}

DrawingBoard.Users.initialize = function(socket, userData, drawBrushCallback) {
	this.users = {};
	var self = this;
	var owner = new User(userData);
	this.ownerID = owner.uid;


	socket.emit('getusers', {});

	socket.on('userlist', function(data) {
		data = JSON.parse(data);
		for (var prop in data) {
			self.addUser(data[prop]);
		}
	});

	socket.on('adduser', function (user) {
		u = JSON.parse(user);
		self.addUser(u, drawBrushCallback);
	});

	socket.emit('join', JSON.stringify(owner));

	return owner;
}

DrawingBoard.Users.getUsers = function () {
	return this.users;
}

DrawingBoard.Users.generateUserBrush = function(user) {
	var brushName = user.brushData.brushName;
	var brushFunc = brushName+"Brush";
	user.brush = new window[brushFunc](user.brushData);
}

DrawingBoard.Users.changeUserBrush = function(brushData, uid) {

}

DrawingBoard.Users.getOwnerId = function () {
	return this.ownerID;
}

DrawingBoard.Users.addUser = function(user, drawBrushCallback) {
	this.generateUserBrush(user);
	this.users[user.uid.toString()] = user;
	if(user.uid == this.ownerID) {
		drawBrushCallback();
	}
}

DrawingBoard.Users.displayUsers = function() {
	//loop through users, add each name to dom
}

DrawingBoard.Users.refreshList = function() {
	//repopulate list from server
}

DrawingBoard.Users.removeUsersFromList = function(id) {
	//remove user id from dom
}
