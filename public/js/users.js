var DrawingBoard = DrawingBoard || {};
DrawingBoard.Users = DrawingBoard.Users || {};

var User = function (userData) {
	this.setAttributes(userData);

	this.setAttributes= function (userData) {
		this.name = userData.name;
		this.uid = getTime();
		this.provider = userData.provider;
		this.name = userData.name;
		this.setBrushData(userData.brushData);
	}
	
	this.setBrushData= function(brushData) {
		this.brushColor = brushData.brushColor;
		this.brushName = brushData.brushName;
		this.brushData = brushData.brushWidth;
	}
}

DrawingBoard.Users.initialize = function (socket, userData) {
	this.socket = socket;
	this.users = {};
	socket.emit('getusers', {});
	socket.on('userlist', function(data) {
		this.users = data;
	});
	var self = this;
	this.owner = new User(userData);
	socket.emit('join', this.owner);
	socket.on('adduser', function(user) {
		self.addUser(user);
	});
}

DrawingBoard.Users.getUsers = function () {
	return users;
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

