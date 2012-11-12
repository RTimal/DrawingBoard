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