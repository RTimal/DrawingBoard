$(document).ready(function(){

	var brush = new lineBrush("black", 0, "circle");
	DrawingBoard.initDrawingBoard(brush);
	DrawingBoard.draw(100,100);
	//brush.setColor("blue");
	brush.setWidth(1);
	DrawingBoard.draw(30,30);
	DrawingBoard.draw(45,30);

});
