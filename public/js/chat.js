var DrawingBoard = DrawingBoard || {}
DrawingBoard.Chat = DrawingBoard.Chat || {}


DrawingBoard.Chat.initialize = function (chatsocket, owner) {
	this.chatsocket = chatsocket;
	this.owner = owner;
	chatsocket.emit('join', JSON.stringify(owner));
}

DrawingBoard.Chat.sendChatMessage = function (message) {
	this.chatsocket.emit('chatmessage', { m: message, uid: this.owner.uid});
}