	function inherit(superclass, subclass) {
		var prototypeObject = Object.create(superclass.prototype);
		prototypeObject.constructor = subclass;
		subclass.prototype = prototypeObject;
	}

	function Brush (color, width) {
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
		context.globalAlpha = .1;
		if ( eventType == "mousedown" ) {
			this.paint = true;
		}

		if ( eventType == "mousemove" ) {
			if ( this.paint == true ) {
				//context.beginPath();
				console.log("Moving To"  + this.prevX + "," + this.prevY);
				context.moveTo(this.prevX, this.prevY);
				context.lineWidth = this.width;
				context.strokeStyle = this.color;
				console.log("Line to" + eventLocation.x + " ," + eventLocation.y)
				context.lineTo(eventLocation.x, eventLocation.y);	
				context.stroke();
				//context.closePath();
			}
		}

		if ( eventType == "mouseup" ) {
			this.paint = false;
		
		}

		this.prevX = eventLocation.x;
		this.prevY = eventLocation.y;
	}