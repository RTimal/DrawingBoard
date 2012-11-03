	function inherit(superclass, subclass) {
		var prototypeObject = Object.create(superclass.prototype);
		prototypeObject.constructor = subclass;
		subclass.prototype = prototypeObject;
	}

	function Brush(color, width) {
		this.color = color;
		this.width = width;
	}

	Brush.prototype.setColor = function(color) {
		this.color = color;
	}

	Brush.prototype.setWidth = function(width) {
		this.width = width;
	}

	Brush.prototype.draw = function(x, y) {

	}

	function lineBrush(brushData) {
		Brush.call(this, brushData.brushColor, brushData.brushWidth);
		this.name = brushData.brushName;
	}

	inherit(Brush, lineBrush);

	lineBrush.prototype.drawToCanvas = function(eventLocation, context, eventType) {
		context.linecap = "round";

		if(eventType == "mousedown") {
			context.beginPath();
			context.moveTo(eventLocation.x, eventLocation.y);
			context.arc(eventLocation.x, eventLocation.y, 1, 0, 2*Math.PI, true);
			context.fillStyle = this.color;
			context.fill();
		}

		if(eventType == "mousemove") {		
			context.lineWidth = this.width;
			context.strokeStyle = this.color;

			context.bezierCurveTo(
				eventLocation.x, 
				eventLocation.y, 
				eventLocation.x, 
				eventLocation.y, 
				eventLocation.x, 
				eventLocation.y,
				eventLocation.x, 
				eventLocation.y
				);
	
			context.stroke();
		}

		if(eventType == "mouseup") {
			context.arc(eventLocation.x, eventLocation.y, 1, 0, 2*Math.PI, true);
			context.stroke();
			context.closePath();
		}
	}
