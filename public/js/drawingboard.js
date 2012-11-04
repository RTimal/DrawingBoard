var DrawingBoard = DrawingBoard || {};

DrawingBoard.initDrawingBoard = function() {
	var canvas = document.getElementById("drawingboard");
	var context = canvas.getContext("2d");
	this.brushlocation = {x:0, y:0};
	this.context = context;
	this.canvas = canvas;
	var self = this;
	this.room = "room";
	this.paint = false;
	this.connectToServer();
	userData = {
		name: this.username, 
		room: this.room,
		provider: "drawingboard",
		brushData: {
			brushName: "line",
			brushColor: "yellow",
			brushWidth: 1.0
		}
	}
	this.Users.initialize(this.socket, userData);
	this.users = this.Users.getUsers();
	this.ownerId = this.Users.getOwnerId();
	this.Events.bindEventHandlers(canvas, this.socket, this.ownerId, function() {
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

DrawingBoard.connectToServer = function () {
	var socket = io.connect('http://192.168.1.12:81');
	this.socket = socket;
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
