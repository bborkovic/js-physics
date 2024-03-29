function Triangle(x,y,width,height,color,alpha,empty){
	if(typeof(color)==='undefined') color = '#0000ff';
	if(typeof(alpha)==='undefined') alpha = 1;	
	if(typeof(empty)==='undefined') empty = false;	
	this.x = x;
	this.y = y;	
	this.width = width;
	this.height = height;
	this.color = color;
	this.alpha = alpha;
	this.empty = empty;
}
Triangle.prototype = {
	draw: function (context) {  		
		context.save();
		if (this.empty){
			context.strokeStyle = this.color;
		}else{
			context.globalAlpha = this.alpha;
			context.fillStyle = this.color;
		}
		context.beginPath();		
		context.moveTo(this.x,this.y);
		context.lineTo(this.x+this.width,this.y);
		context.lineTo(this.x+this.width/2,this.y-this.height);
		context.lineTo(this.x,this.y);	
		context.closePath();		
		if (this.empty) {
			context.stroke();
		}else{
			context.fill();
		}
		context.restore();
	}
};

		