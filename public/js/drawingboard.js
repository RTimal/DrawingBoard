var DrawingBoard = DrawingBoard || {};

DrawingBoard.initDrawingBoard = function(username) {
	this.initializeCanvases();
	var self = this;
	this.room = this.Utils.getParam("room");
	if(this.room == undefined) {
	this.room = "Lobby"
	}
	this.username = "guest";
	this.username = prompt("Please enter your chat name", "Guest");

	userData = {
		name: this.username, 
		room: this.room,
		provider: "drawingboard",
		brushData: {
			brushName: "line",
			brushColor: "rgb(230, 51, 51)",
			brushWidth: 20,
		}
	}

	this.connectToEventsServer();
	this.connectToChatServer();

	var owner = this.Users.initialize(this.socket, userData, function () {
		self.drawCurrentBrush();
	});

	this.owner = owner;
	this.users = this.Users.getUsers();
	

	this.Chat.initialize(this.chatsocket, owner, this.users);
	
	this.Events.bindEventHandlers(this.canvas, this.socket, this.chatsocket, owner,
	 	//callback for emitting events
		function (location) {
			self.refresh(location);
		}, 
		//callback for drawing
		function (eventType, userID, brushlocation) {
			self.draw(eventType, userID, brushlocation);
		}, 
		//callback for sending chat messages
		function (message) {
			self.Chat.sendChatMessage(message);
		},

		function (color, uid) {
			self.changeBrushColor(color, uid);
			if(uid == self.owner.uid) { 
				self.emitBrushColor(color, uid);
			}
		});
}

DrawingBoard.emitBrushColor = function(color, id) {
	this.socket.emit('changebrushcolor',  {c: color, uid: id});
}

DrawingBoard.initializeCanvases = function() {
	var canvas = document.getElementById("drawingboard");
	var context = canvas.getContext("2d");
	this.brushViewContext = document.getElementById("brush").getContext("2d");
	this.brushViewContext.canvas.width = 100;
	this.brushViewContext.canvas.height = 100;
	this.brushlocation = {x:0, y:0};
	this.context = context;
	this.canvas = canvas;
}

DrawingBoard.setBrushLocation = function(brushlocation) {
	this.brushlocation = brushlocation;
}

DrawingBoard.refresh = function(location) {
		var event = this.Events.getNextMouseEvent();

		if(event.type == "mousedown") {
			this.paint = true;
			this.socket.emit('mousedown', {
					brushlocation: location,
					ownerId:this.owner.uid,
					room: this.room
				});
		} 

		if(event.type == "mousemove") {
			if(this.paint == true) {
				this.socket.emit('mousemove', {
					brushlocation: location,
					ownerId:this.owner.uid,
					room: this.room
				});
			}
		}

		if(event.type == "mouseup") {
			this.paint = false;
				this.socket.emit('mouseup', {
					brushlocation: location,
					ownerId:this.owner.uid,
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

DrawingBoard.changeBrushColor = function(color, uid) {
	var user = this.users[uid];
	user.changeBrushColor(color);
	if(uid == this.owner.uid) {
		this.drawCurrentBrush(this.brushViewContext);
	}
}

DrawingBoard.drawCurrentBrush = function() {
	var thisuser = this.users[this.owner.uid];
	thisuser.drawCurrentBrush(this.brushViewContext);
}

DrawingBoard.draw = function(eventType, userID, brushlocation) {
	if(this.users[userID]!=null) {
		var user = this.users[userID];
		user.draw(brushlocation, this.context, eventType);
	}
}