var DrawingBoard = DrawingBoard || {};
DrawingBoard.Events = DrawingBoard.Events || {};

DrawingBoard.Events.bindEventHandlers = function (canvas, socket, chatsocket, owner, emitEvent, drawCallBack, chatCallback, changeBrushColorCallBack) {
	this.chatsocket = chatsocket;
	this.canvas = canvas;
	this.owner = owner;
	this.bindDOMEvents(changeBrushColorCallBack);
	this.bindChatEvents(chatCallback);
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

	socket.on('changebrushcolor', function (data) {
		changeBrushColorCallBack(data.c, data.uid);
	});

	$('canvas').mousedown(function(event) {
		self.addEvent(event);
		var canvasLocation = {x:event.pageX - self.canvasOffsetLeft, y:event.pageY - self.canvasOffsetTop};
		emitEvent(canvasLocation);
		drawCallBack('mousedown', owner.uid, canvasLocation);
	});

	$('canvas').mousemove(function(event) {
		self.addEvent(event);
		var canvasLocation = {x:event.pageX - self.canvasOffsetLeft, y:event.pageY - self.canvasOffsetTop};
		emitEvent(canvasLocation);
		drawCallBack('mousemove', owner.uid, canvasLocation);
	});

	$('html').mouseup(function(event) {
		self.addEvent(event);
		var canvasLocation = {x:event.pageX - self.canvasOffsetLeft, y:event.pageY - self.canvasOffsetTop};
		emitEvent(canvasLocation);
		drawCallBack('mouseup', owner.uid, canvasLocation);
	});


}

DrawingBoard.Events.bindDOMEvents = function(changeBrushColorCallBack) {

	$('#slider').slider({
		min:1, 
		max:30, 
		disabled:false, 
		animate: true, 
		step:1,
		slide: function(event, ui) {
			console.log(ui.value);
		}
	});

	$('#gallerybutton').mouseup(function (event) {
		window.open("/gallery", '_self', false);
	});

	$('#backbutton').mouseup(function (event) {
		window.open("/", '_self', false);
	});

	var self = this;
	
	$('#textbox').focus();

	$('#username #value').text(this.owner.name);
	$('#room #value').text(this.owner.room);

	$('#drawingboard').mousedown(function (event) {
		$('#tools').addClass("unselectable");
		$('#chattool').addClass("unselectable");
		$('#titlebar').addClass("unselectable");
	});

	$('html').mouseup(function (event) {
		$('#titlebar').removeClass("unselectable");
		$('#tools').removeClass("unselectable");
		$('#chattool').removeClass("unselectable");
	});


	$(window).resize(function () {
		self.canvasOffsetLeft = $(self.canvas).offset().left;
		self.canvasOffsetTop = $(self.canvas).offset().top; 
	});

	$("#picker").spectrum({
		showAlpha: true,
		clickoutFiresChange: true,
		flat: true,
		showInput: true,
		preferredFormat: "rgb",
		move: function(tinycolor) {
			var color = tinycolor.toRgb();
			var c = "rgba(" + color.r + "," +  color.g + "," + color.b + "," + color.a + ")";
			changeBrushColorCallBack(c, self.owner.uid);
		}
	});
	
}

DrawingBoard.Events.bindChatEvents = function (chatCallback) {

	var self = this;
		
	$('#send').mouseup(function (event) {
		$('#textbox').focus();
		var message = { m: $('#textbox').val(), uid: self.owner.uid };
		if($('#textbox').val()!='') {
			chatCallback(message);
		}
	});

	$('#textbox').keydown(function (event) {
		if(event.keyCode == 13) {
			$('#send').addClass("activeButton");
		}

	});

	$('#textbox').keyup(function (event) {
		if(event.keyCode == 13) {
			$('#send').removeClass("activeButton");
			if($(this).val()!='') {
				var message = { m: $('#textbox').val(), uid: self.owner.uid };
				chatCallback(message);
			}
		}
		event.cancelBubble = true;
		event.returnValue = false;
		event.stopPropagation();
	});


	this.chatsocket.on('chatmessage', function (message) {
		chatCallback(message);
	});

}

DrawingBoard.Events.addEvent = function(event) {
	this.mouseEvents.push(event);
}

DrawingBoard.Events.getNextMouseEvent = function() {
	return this.mouseEvents.shift();
}

DrawingBoard.Events.getMouseEvents = function() {
	return this.mouseEvents;
}

