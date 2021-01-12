let cursor = function(p) {
	let last_click = -100;
	let cur_num = 10;
	var curX = new Array(cur_num);
	var curY = new Array(cur_num);
	var Ccanvas;
	p.setup = function(){

	  for(i = 0; i < cur_num; i++){
		curX[i] =0;
		curY[i] =0;
	  }

	  Ccanvas = p.createCanvas(p.windowWidth, p.windowHeight);
	  Ccanvas.position(0,0,'fixed');
	  Ccanvas.style("z-index","1");
	  Ccanvas.style("pointer-events","none");
	  

	}

	p.draw = function(){

	  p.resizeCanvas(p.windowWidth, p.windowHeight);
	  p.fill(225+25*p.sin(p.millis()/500),30);
	  p.noStroke();
	  curX[0] = p.mouseX;
	  curY[0] = p.mouseY;
	  p.ellipse(curX[0],curY[0],40,40);
	  p.fill(0);
	  //p.text(p.millis()-last_click,10,10);
	  p.fill(225+25*p.sin(p.millis()/500),20);
	  for(i = 1; i < cur_num; i++){
		curX[i] += ((curX[i-1]-curX[i]))/(50*0.03);
		curY[i] += ((curY[i-1]-curY[i]))/(50*0.03);
		p.ellipse(curX[i],curY[i],40-2*i,40-2*i);
	  }
	  
      //p.background(240,1/(1+p.exp(10*((p.millis()-last_click)/1000)))*50);

	}

	p.mousePressed = function(){
	  last_click = p.millis();
	}
};

let cur = new p5(cursor);
