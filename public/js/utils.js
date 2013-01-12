var DrawingBoard = DrawingBoard || {};
DrawingBoard.Utils = DrawingBoard.Utils || {};

DrawingBoard.Utils.getParam = function (key) {
	var queryString = window.location.search.substring(1);
	var keyValues = queryString.split('&');
	for (var i = 0; i < keyValues.length; i++)
	{
		var pair = keyValues[i].split('=');
		if (pair[0] == key)
		{
			return pair[1];
		}
	}
}

DrawingBoard.Utils.uniqid = function() {
	var newDate = new Date;
	var partOne = newDate.getTime();
	var partTwo = 1 + Math.floor((Math.random()*32767));
	var partThree = 1 + Math.floor((Math.random()*32767));
	var id = partOne + '-' + partTwo + '-' + partThree;
	return id;
}

DrawingBoard.Utils.getGuestName = function() {
	var u = this.uniqid();
	return "guest" + u.substr(u.length-4,u.length);
}