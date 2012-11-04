var DrawingBoard = DrawingBoard || {};

DrawingBoard.initDrawingBoard = function() {
	var canvas = document.getElementById("drawingboard");
	var context = canvas.getContext("2d");
	this.brushlocation = {x:0, y:0};
	this.context = context;
	this.canvas = canvas;
	var self = this;
	this.room = "room";

	this.Events.bindEventHandlers(canvas, function(){
		self.refresh();
	});

	this.paint = false;
	this.dragging = false;
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
	var self = this;

	this.socket.on('mousedown', function (drawevent) { 
		self.draw('mousedown', drawevent.ownerId, drawevent.brushlocation);
	});

	this.socket.on('mouseup', function (drawevent) {
		self.draw('mouseup', drawevent.ownerId, drawevent.brushlocation);
	});

	this.socket.on('mousemove', function (drawevent) {
		self.draw('mousemove', drawevent.ownerId, drawevent.brushlocation );
	});

}

DrawingBoard.setBrushLocation = function(brushlocation) {
	this.brushlocation = brushlocation;
}

DrawingBoard.refresh = function() {
	for(var i = 0; i < this.Events.getMouseEvents().length; i++) {
		var event = this.Events.getNextMouseEvent();
		this.setBrushLocation({x:event.pageX - this.canvas.offsetLeft, y:event.pageY - this.canvas.offsetTop});

		if(event.type == "mousedown") {
			this.paint = true;
			this.draw('mousedown', this.ownerId, this.brushlocation);
			this.socket.emit('mousedown', {
					brushlocation: this.brushlocation,
					ownerId: this.ownerId,
					room: this.room
				});
		} 

		if(event.type == "mouseup") {
			this.paint = false;
			this.draw('mouseup', this.ownerId, this.brushlocation);
			this.socket.emit('mouseup', {
				brushlocation: this.brushlocation,
				ownerId: this.ownerId,
				room: this.room
			});

		}

		if(event.type == "mousemove") {
			if(this.paint==true) {
				this.draw('mousemove', this.ownerId, this.brushlocation);
				this.socket.emit('mousemove', {
					brushlocation: this.brushlocation,
					ownerId: this.ownerId,
					room: this.room
				});
			}
		}
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
