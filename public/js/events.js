var DrawingBoard = DrawingBoard || {};
DrawingBoard.Events = DrawingBoard.Events || {};

DrawingBoard.Events.bindEventHandlers = function (canvas, socket, chatsocket, owner, emitEvent, drawCallBack, chatCallback, changeBrushColorCallBack, changeBrushWidthCallBack) {
	this.chatsocket = chatsocket;
	this.drawingsocket = socket;
	this.canvas = canvas;
	this.owner = owner;
	this.bindDOMEvents(changeBrushColorCallBack, changeBrushWidthCallBack);
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

	socket.on('changebrushcolor', function (colorinfo) {
		changeBrushColorCallBack(colorinfo.c, colorinfo.uid);
	});

	socket.on('changebrushwidth', function (widthinfo) {
		changeBrushWidthCallBack(widthinfo.w, widthinfo.uid);
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

DrawingBoard.Events.bindDOMEvents = function(changeBrushColorCallBack, changeBrushWidthCallBack) {
	var self = this;
	$('#publish').live('click',function() {
		var uid = self.owner.uid;
		var title = "hey";
		//$.post('/publish', {image: self.canvas.toDataURL(), uid: uid, title:title });
		FB.getLoginStatus(function(response) {
			if(response.status === 'connected') {
				var uid = response.authResponse.userID;
				var accessToken = response.authResponse.accessToken;
				var title = prompt('please enter a title for this artwork', 'my awesome');
				$.post('/publish', {image: self.canvas.toDataURL(), uid: uid, title:title });
			} else if (response.status === 'not authorized') {
				alert("Please log in with facebook before you can publish");
			} else {
				alert("Please log in with facebook before you can publish");
			}
		}); 
	});

	$('#save').live('click',function(){
		var image = self.canvas.toDataURL();
		 event.preventDefault();
			var newForm = jQuery('<form>', {
				'action': '/save',
				'target': '_top',
				'method': 'post'
			}).append(jQuery('<input>', {
				'name': 'image',
				'value': image,
				'type': 'hidden'
			}));
			newForm.submit();
	});


	$('#slider').slider({
		min:1, 
		max:50, 
		disabled:false, 
		animate: true, 
		step:1,
		slide: function(event, ui) {
			changeBrushWidthCallBack(ui.value, self.owner.uid);
		}
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

	$('#gallerybutton').mouseup(function (event) {
		window.open("/gallery", '_self', false);
	});

	$('#backbutton').mouseup(function (event) {
		window.open("/", '_self', false);
	});

	
	$('#textbox').focus();

	$('#username #value').text(this.owner.name);
	$('#roomtitle #value').text(this.owner.room);

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

DrawingBoard.Events.changeUser = function(data) {
	$('#username #value').text(data.username);
		//change name on users list
	//change name for everyone else
	//change your uid
	//change uid on server
	//change uid for everyone else to fb uid
	this.drawingsocket.emit('changeuser', JSON.stringify({u:data.username, uid: data.uid, provider: data.provider}));
}

DrawingBoard.Events.initSocialUser = function(userData) {
	var self = this;
	this.Social.initFb(userData, function(data) {
		self.changeUser(data);
	});
}
