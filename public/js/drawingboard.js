var DrawingBoard = DrawingBoard || {};

DrawingBoard.initDrawingBoard = function(brush) {
	var canvas = document.getElementById("drawingboard");
	var context = canvas.getContext("2d");
	this.brushlocation = {x:0, y:0};
	this.context = context;
	this.canvas = canvas;
	this.activeBrush = brush;
	var self = this;

	this.Events.bindEventHandlers(canvas, function(){
		self.refresh();
	});

	this.paint = false;
	this.dragging = false;
	this.connectToServer();

	userData = {
		name: this.username, 
		room: "room",
		provider: "drawingboard",
		brush: new lineBrush({brushColor:"red", brushWidth: 4.0})
	}

	this.Users.initialize(this.socket, userData);
	this.ownerId = this.Users.getOwnerId();
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
			this.draw(event.type);
			this.socket.emit('drawevent', {
					drawevent: 0,
					brushlocation: this.brushlocation,
					ownerId: this.OwnerId
				});
		} 

		if(event.type == "mouseup") {
			this.paint = false;
			this.draw(event.type);
			this.socket.emit('drawevent', {
				drawEvent: 1,
				brushLocation: this.brushlocation,
				OwnerId: this.OwnerId
			});
		}
		

		if(event.type == "mousemove"){
			if(this.paint==true) {
				this.draw(event.type);
				this.socket.emit('drawevent', {
					drawevent: 2,
					brushlocation: this.brushlocation,
					OwnerId: this.ownerid
				});
			}
		}

	}
}

DrawingBoard.connectToServer = function () {
	var socket = io.connect('http://localhost:81');
	this.socket = socket;
}

DrawingBoard.setBrush = function(brush) {
	this.activeBrush = brush;
}


DrawingBoard.draw = function(eventType) {
	this.Users.owner.brush.drawToCanvas(this.brushlocation, this.context, eventType);
}