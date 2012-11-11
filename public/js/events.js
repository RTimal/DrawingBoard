var DrawingBoard = DrawingBoard || {};
DrawingBoard.Events = DrawingBoard.Events || {};


DrawingBoard.Events.addEvent = function(event) {
	this.mouseEvents.push(event);
}

DrawingBoard.Events.getNextMouseEvent = function() {
	return this.mouseEvents.shift();
}

DrawingBoard.Events.getMouseEvents = function() {
	return this.mouseEvents;
}

DrawingBoard.Events.bindDOMEvents = function() {
	$('canvas').mousedown(function(event) {
		$('#tools').addClass("unselectable");
		$('#chattool').addClass("unselectable");
		$('#titlebar').addClass("unselectable");
	});

	$('html').mouseup(function(event) {
		$('#titlebar').removeClass("unselectable");
		$('#tools').removeClass("unselectable");
		$('#chattool').removeClass("unselectable");
	});
}

DrawingBoard.Events.bindEventHandlers = function(canvas, socket, ownerId, emitEvent, drawCallBack) {
	this.bindDOMEvents();
	this.mouseEvents = Array();
	offsetLeft = $(canvas).offset().left;
	offsetTop = $(canvas).offset().top
	var self = this;

	socket.on('mousedown', function (drawevent) { 
		drawCallBack('mousedown', drawevent.ownerId, drawevent.brushlocation);
	});

	socket.on('mouseup', function (drawevent) {
		drawCallBack('mouseup', drawevent.ownerId, drawevent.brushlocation);
	});

	socket.on('mousemove', function (drawevent) {
		drawCallBack('mousemove', drawevent.ownerId, drawevent.brushlocation );
	});

	$('canvas').mousedown(function(event) {
		self.addEvent(event);
		emitEvent();
		drawCallBack('mousedown', ownerId, {x:event.pageX - offsetLeft, y:event.pageY - offsetTop});
	});

	$('canvas').mousemove(function(event) {
		self.addEvent(event);
		emitEvent();
		drawCallBack('mousemove', ownerId, {x:event.pageX - offsetLeft, y:event.pageY - offsetTop});
	});

	$('html').mouseup(function(event) {
		self.addEvent(event);
		emitEvent();
		drawCallBack('mouseup', ownerId, {x:event.pageX - offsetLeft, y:event.pageY - offsetTop});
	});
}


