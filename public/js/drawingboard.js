var DrawingBoard = DrawingBoard || {};

DrawingBoard.initDrawingBoard = function(username) {
	var canvas = document.getElementById("drawingboard");
	var context = canvas.getContext("2d");
	this.brushlocation = {x:0, y:0};
	this.context = context;
	this.canvas = canvas;
	var self = this;
	this.room = this.Utils.getParam("room");
	if(this.room == undefined) {
	this.room = "Lobby"
	}

	userData = {
		name: this.username, 
		room: this.room,
		provider: "drawingboard",
		brushData: {
			brushName: "line",
			brushColor: "green",
			brushWidth: 3.0
		}
	}

	this.connectToEventsServer();
	this.connectToChatServer();
	

	var owner = this.Users.initialize(this.socket, userData);
	this.users = this.Users.getUsers();
	this.ownerId = this.Users.getOwnerId();

	this.Chat.initialize(this.chatsocket, owner);
	
	this.Events.bindEventHandlers(canvas, this.chatsocket, this.socket, this.ownerId, function() {
		self.refresh();
	}, function(eventType, userID, brushlocation) {
		self.draw(eventType, userID, brushlocation);
	});
}

DrawingBoard.setBrushLocation = function(brushlocation) {
	this.brushlocation = brushlocation;
}

DrawingBoard.refresh = function() {
		var event = this.Events.getNextMouseEvent();
		this.setBrushLocation({x:event.pageX - this.canvas.offsetLeft, y:event.pageY - this.canvas.offsetTop});

		if(event.type == "mousedown") {
			this.socket.emit('mousedown', {
					brushlocation: this.brushlocation,
					ownerId: this.ownerId,
					room: this.room
				});
		} 

		if(event.type == "mouseup") {
			this.socket.emit('mouseup', {
				brushlocation: this.brushlocation,
				ownerId: this.ownerId,
				room: this.room
			});
		}

		if(event.type == "mousemove") {
				this.socket.emit('mousemove', {
					brushlocation: this.brushlocation,
					ownerId: this.ownerId,
					room: this.room
				});
		}
}

DrawingBoard.connectToEventsServer = function () {
	var socket = io.connect('http://localhost:81');
	this.socket = socket;
}

DrawingBoard.connectToChatServer = function () {
	var chatsocket = io.connect('http://localhost:82');
	this.chatsocket = chatsocket;
}

DrawingBoard.setBrush = function(brush) {
	this.activeBrush = brush;
}

DrawingBoard.draw = function(eventType, userID, brushlocation) {
	if(this.users[userID]!=null) {
		var thisuser = this.users[userID];
		thisuser.brush.drawToCanvas(brushlocation, this.context, eventType);
	}
}
