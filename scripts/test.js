let background = function(p) {
  class Cloud{

  	constructor(x, y, s){
  	  this.x = x;
  	  this.y = y;
  	  this.s = s;
  	}
  }
  let clouds_num = 5;
  var clouds = new Array(clouds_num);
  var canvas;
  var background_image;
  var sky_image;
  var decal = Array(9);
  var mountain_image;
  var lake_image;
  var cloud;
  let W,H,BM
  let start = 0;
  p.setup = function(){
    cloud = p.loadImage('images/cloud.png');
    background_image = p.loadImage('images/forest.png');
    lake_image = p.loadImage('images/foreground.png');
    mountain_image = p.loadImage('images/backgroundM.png');
    sky_image = p.loadImage('images/background.png');

    for(i =0; i < clouds_num; i ++){
      clouds[i] = new Cloud(p.random(),p.random(0.5),p.random(0.005)+0.0025);
    }
    W = p.windowWidth;
    H = p.windowHeight*1.1;
    BM = W/H>16/9;
    canvas = p.createCanvas(W, H);
    canvas.position(0,0,"fixed");
    canvas.style("z-index","-1");
    start = 0;

    
    for(i =0; i < 9; i ++){
      decal[i] = p.random(7);
 }
  };

let last_known_scroll_position = 0;
let ticking = false;

	window.addEventListener('scroll', function(e) {
	  last_known_scroll_position = window.scrollY;

	  if (!ticking) {
		window.requestAnimationFrame(function() {
		  
	      //canvas.position(0,window.scrollY);
		  ticking = false;
		});

		ticking = true;
	  }
	});
	
	
	
  p.draw = function(){
	  var y = window.scrollY;
	  canvas.style("top",(-(window.scrollY/document.body.clientHeight)*0.1*H)+"px");
	  
      start += 1/p.frameRate();
      p.background(90);
      let wi,he,dw,dh;
      if(BM){
    	dw = 0;
    	dh = (H/2)-(9/32)*W;
    	wi = W;
    	he = (9/16)*W;
      }else{
    	
            dh = 0;
            dw = (W/2)-(8/9)*H;
            wi = (16/9)*H;
            he = H;
      }

      //p.image(p.background_p.image,dw,dh,wi,he);
      p.image(sky_image,dw,dh,wi,he);

      for(i =0; i < clouds_num; i ++){
        p.image(cloud,dw+clouds[i].x*wi,dh+clouds[i].y*he,0.2*wi,0.2*he);
        if(p.frameRate() > 1){
        	clouds[i].x += clouds[i].s/p.frameRate();
        }
        if(clouds[i].x > 1.2 ){
          clouds[i].x = -0.2;
          clouds[i].y = p.random(0.6);
        }

      }

      p.image(mountain_image,dw,dh,wi,he);
      p.image(lake_image,dw,dh,wi,he);
      p.background(242,221,125,(1/(p.exp(2*p.pow((p.millis()/1000),4)-5)+1))*255);
      p.background(230,40);

      
      p.noStroke(); 
      p.fill(200,200,180,(sinus2(decal[8],decal[0])+1)*5+14);
        p.beginShape();
        p.vertex((W*0.5)+sinus(decal[0])*10, 0);
        p.vertex((W*0.6)+sinus(decal[1])*10, 0);
        p.vertex((W*0.4)+sinus(decal[1])*10, H);
        p.vertex(sinus(decal[1])*10, H);
        p.endShape();

        
        p.beginShape();
        p.vertex((W*0.45)+(p.sin((p.millis()/1000)+decal[4])*10), 0);
        p.vertex((W*0.5)+(p.sin((p.millis()/1000)+decal[5])*10), 0);
        p.vertex((W*0.2)+(p.sin((p.millis()/1000)+decal[6])*10), H);
        p.vertex((W*-0.1)+(p.sin((p.millis()/1000)+decal[7])*10), H);
        p.endShape();
  };


  function sinus(d){

    return (p.sin((p.millis()/2000)+d)+p.sin((p.millis()/2000)*2+d)+p.sin((p.millis()/2000)*(-3)+d))*4
} 
function sinus2(d1,d2){

  return (p.sin((p.millis()/2000)+d1)+p.sin((p.millis()/2000)*2+d2)+p.sin((p.millis()/2000)*(-3)+d1)*4+p.sin((p.millis()/2000)*(-6)+d2))*2
}
  p.windowResized = function() {
    W = p.windowWidth;
    H = p.windowHeight*1.1;
    BM = W/H>16/9;
    p.resizeCanvas(W,H);
  };
};



let Bp5 = new p5(background);