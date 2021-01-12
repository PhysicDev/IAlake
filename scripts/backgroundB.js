let backgroundB = function(p) {

    class ball{

        constructor(s){
            this.x = p.random(p.windowWidth);
            this.y = p.random(p.windowHeight);
            this.s = s;
            this.dec = p.random(7)
        }

        show(){
            p.noStroke()
            p.fill(200,200,180,(sinus(this.dec)+1)*5);
            p.ellipse(this.x+sinus(this.dec)*10,this.y,this.s,this.s);
        }
    }
    ball_num = 10;
    var balls = Array(ball_num);
    var decal = Array(8);
    var canvas;
    var back, TV;
    let BM;
    let W,H;
    p.setup = function(){
        
        back = p.loadImage('http://89.82.115.147:2500/project/images/bunker.png');
        TV = p.loadImage('http://89.82.115.147:2500/project/images/TV.png');
       for(i =0; i < ball_num; i ++){
            balls[i] = new ball(p.random(70)+30);
       }
       for(i =0; i < 8; i ++){
             decal[i] = p.random(7);
        }
        W = p.windowWidth;
        H = p.windowHeight*1.1;
        BM = W/H>16/9;
        canvas = p.createCanvas(W, H);
        canvas.position(0,0,"fixed");
        canvas.style("z-index","-1");


    };

    p.draw = function(){
        
        p.background(20,20,25);
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

      p.image(back,dw,dh,wi,he);
        balls.forEach(element => element.show());

        
        p.fill(200,200,180,(sinus(decal[0])+1)*5);
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
      
        //p.image(TV,dw+wi*0.18,dh,wi*0.6,he);
    };

    function sinus(d){

        return p.sin((p.millis()/2000)+d)+p.sin((p.millis()/2000)*2+d)+p.sin((p.millis()/2000)*(-3)+d)
    }

    p.windowResized = function() {
        W = p.windowWidth;
        H = p.windowHeight*1.1;
        BM = W/H>16/9;
        p.resizeCanvas(W,H);
      };
};



let BgB = new p5(backgroundB);