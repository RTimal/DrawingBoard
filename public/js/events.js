var DrawingBoard = DrawingBoard || {};
DrawingBoard.Events = DrawingBoard.Events || {};


DrawingBoard.Events.addEvent = function(event) {
	this.mouseEvents.push(event);
}

DrawingBoard.Events.getNextMouseEvent = function(event) {
	return this.mouseEvents.shift();
}

DrawingBoard.Events.getMouseEvents = function(event) {
	return this.mouseEvents;
}

DrawingBoard.Events.bindEventHandlers = function(canvas, refreshCallback) {
	this.mouseEvents = Array();
	offsetLeft = $(canvas).offset().left;
	offsetTop = $(canvas).offset().top
	var self = this;

	$(canvas).mousedown(function(event) {
		self.addEvent(event);
		refreshCallback();
	});

	$(canvas).mousemove(function(event) {
		self.addEvent(event);
		refreshCallback();
	});

	$(canvas).mouseup(function(event) {
		self.addEvent(event);
		refreshCallback();
	});

	


}


