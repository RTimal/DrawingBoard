var DrawingBoard = DrawingBoard || {};
DrawingBoard.Users = DrawingBoard.Users || {};


function User(name) {
	this.id = this.users.length;
	this.name = name;
	
	this.setBrushData= function(brushData) {
		this.brushColor = brushData.brushColor;
		this.brushName = brushData.brushName;
		this.brushData = brushData.brushWidth;
	}

	this.setName = function(name) {
		this.name = name;
	}

}

DrawingBoard.Users.setUsers = function (users) {
	this.users = users;
}

DrawingBoard.Users.getUsers = function () {
	return users;
}

DrawingBoard.Users.AddUser = function (userName) {
	var newUser = new User(userName);
	this.users['id'] = newUser.id;
}

DrawingBoard.Users.DisplayUsers = function () {
	//loop through users, add each name to dom
}

DrawingBoard.Users.RefreshList = function() {
	//repopulate list from server
}

DrawingBoard.Users.removeUsersFromList = function (id) {
	//remove user id from dom
}

DrawingBoard.Users.setBrushdata = function (userId, brushData) {, 
	this.users[userId].brushInfo = brushData;
}

