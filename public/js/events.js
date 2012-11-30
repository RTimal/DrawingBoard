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

	var self = this;
	
	$('#textbox').focus();

	$('#username #value').text(this.owner.name);
	$('#room #value').text(this.owner.room);

	$('canvas').mousedown(function (event) {
		$('#tools').addClass("unselectable");
		$('#chattool').addClass("unselectable");
		$('#titlebar').addClass("unselectable");
	});

	$('html').mouseup(function (event) {
		$('#titlebar').removeClass("unselectable");
		$('#tools').removeClass("unselectable");
		$('#chattool').removeClass("unselectable");
	});

	$('#send').click(function(event){
		console.log("heey");
	});

	$('#textbox').keydown(function(event) {
		if($(this).val()!='') {
			if(event.keyCode == 13) {
				var text = $(this).val();
				$(this).val('');
				var $msg = $('<div class="chatrow"><span class="ownername">' + self.owner.name + ': </span>'+ '<span class="chatline">'+text+'</span></div>');
				$('#send').addClass("activeButton");
				$('#send').trigger("click");
				$("#chatboard").append($msg);
				var scrollHeight = $('#chatboard')[0].scrollHeight;
				$('#chatboard').scrollTop(scrollHeight);
			}
		}
	});

	$('#textbox').keyup(function(event) {
		if(event.keyCode == 13) {
			$('#send').removeClass("activeButton");
		}
	});

	$(window).resize(function () {
		self.canvasOffsetLeft = $(self.canvas).offset().left;
		self.canvasOffsetTop = $(self.canvas).offset().top; 
	});
	
}

DrawingBoard.Events.bindEventHandlers = function(canvas, chatsocket, socket, owner, emitEvent, drawCallBack) {
	this.canvas = canvas;
	this.owner = owner;
	this.bindDOMEvents();
	this.mouseEvents = Array();
	var self = this;

	this.canvasOffsetLeft = $(this.canvas).offset().left;
	this.canvasOffsetTop = $(this.canvas).offset().top;

	socket.on('mousedown', function (drawevent) {
		drawCallBack('mousedown', drawevent.ownerId, drawevent.brushlocation);
	});

	socket.on('mouseup', function (drawevent) {
		drawCallBack('mouseup', drawevent.ownerId, drawevent.brushlocation);
	});

	socket.on('mousemove', function (drawevent) {
		drawCallBack('mousemove', drawevent.ownerId, drawevent.brushlocation);
	});

	$('canvas').mousedown(function(event) {
		self.addEvent(event);
		emitEvent();
		drawCallBack('mousedown', owner.uid, {x:event.pageX - self.canvasOffsetLeft, y:event.pageY - self.canvasOffsetTop});
	});

	$('canvas').mousemove(function(event) {
		self.addEvent(event);
		emitEvent();
		drawCallBack('mousemove', owner.uid, {x:event.pageX - self.canvasOffsetLeft, y:event.pageY - self.canvasOffsetTop});
	});

	$('html').mouseup(function(event) {
		self.addEvent(event);
		emitEvent();
		drawCallBack('mouseup', owner.uid, {x:event.pageX - self.canvasOffsetLeft, y:event.pageY - self.canvasOffsetTop});
	});
}


