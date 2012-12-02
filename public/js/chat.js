var DrawingBoard = DrawingBoard || {}
DrawingBoard.Chat = DrawingBoard.Chat || {}

DrawingBoard.Chat.initialize = function(chatsocket, owner, users) {
	this.chatsocket = chatsocket;
	this.owner = owner;
	this.users = users;
	chatsocket.emit('join', JSON.stringify(owner));
}

DrawingBoard.Chat.sendChatMessage = function(message) {
	console.log(message);
	var text = $('#textbox').val();
	if(message.uid == this.owner.uid) {
		this.sendToSelf(message);
		this.sendToOthers(message);
		$('#textbox').focus();
	} else {
		this.sendToSelf(message);
	}
}

DrawingBoard.Chat.sendToSelf = function(message) {
	var $msg = $('<div class="chatrow"><span class="ownername">' + this.users[message.uid].name + ': </span>' + '<span class="chatline">'+ message.m + '</span></div>');
	$("#chatboard").append($msg);
	var scrollHeight = $('#chatboard')[0].scrollHeight;
	$('#chatboard').scrollTop(scrollHeight);
	$('#textbox').val('');
}

DrawingBoard.Chat.sendToOthers = function(message) {
	this.chatsocket.emit('chatmessage', message);
}