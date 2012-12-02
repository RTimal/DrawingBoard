var DrawingBoard = DrawingBoard || {}
DrawingBoard.Chat = DrawingBoard.Chat || {}

DrawingBoard.Chat.initialize = function(chatsocket, owner) {
	this.chatsocket = chatsocket;
	this.owner = owner;
	chatsocket.emit('join', JSON.stringify(owner));
}

DrawingBoard.Chat.sendChatMessage = function() {
	var text = $('#textbox').val();
	this.sendToSelf(text);
	this.sendToOthers(text)
	$('#textbox').focus();
}

DrawingBoard.Chat.sendToSelf = function(text) {
	$('#send').removeClass("activeButton");
	var $msg = $('<div class="chatrow"><span class="ownername">' + this.owner.name + ': </span>'+ '<span class="chatline">'+text+'</span></div>');
	$("#chatboard").append($msg);
	var scrollHeight = $('#chatboard')[0].scrollHeight;
	$('#chatboard').scrollTop(scrollHeight);
	$('#textbox').val('');
}


DrawingBoard.Chat.sendToOthers = function(text) {
	this.chatsocket.emit('chatmessage', { m: text, uid: this.owner.uid});
}