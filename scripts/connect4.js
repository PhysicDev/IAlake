
$(document).ready(function(){
    $("#new").click(function() {
        playGrid.reset();
        reset_extractor();
        console.log(ip);
    });
    $("#mode").click(function() {
        if(playGrid.player == "humain"){
            $(this).children("span").html("algorithme");
            playGrid.player = "algorithme";
            if(AIlevel > 4){
                AIlevel = 4;
            }
        }else{
            $(this).children("span").html("humain");
            playGrid.player = "humain";
            AIlevel = 0;
        }
    });
    $("#lvl").click(function() {
        AIlevel += 1;
        if(AIlevel > 4){
            AIlevel = 0;
        }
        $(this).children("span").html("niveau "+AIlevel);
    });
    $("#main").click(function() {
        playGrid.firstPlayer = !playGrid.firstPlayer;
        if(playGrid.firstPlayer){
            $(this).children("span").html("joueur 1");
        }else{
            $(this).children("span").html("joueur 2");
        }
    });
});

var AIlevel = 0;
var playGrid;
var minimaxCalculator = new Worker("https://ialake.netlify.app/scripts/workerMinimax.js");
var mail = new Worker("https://ialake.netlify.app/scripts/data_send.js");
var extractor = new Object();
var game_send = 0;
var ip ="";

minimaxCalculator.onmessage = function(e) {
    playGrid.play(e.data);
}

mail.onmessage = function(e) {
}

function get_ip(){
    //flemme de reprogrammer la requete d'ip pour la version statique
    ip = "netlify";
}

function reset_extractor(){
    extractor = new Object();
    extractor.type = "gameC4";
    extractor.ip_address = ip;
    extractor.streak = game_send;
    extractor.player = ["humain",playGrid.player]
    extractor.game = new Array();
    extractor.game.push(playGrid.data);
}



function emit_extractor(winner = 0,turn = 0){
    extractor.winner = winner;
    extractor.turn = turn;
    console.log(extractor);
    console.log(JSON.stringify(extractor));
    mail.postMessage(JSON.stringify(extractor));
    game_send += 1;
}

class grid{

    constructor(width,height,w = 7,h = 6,pref){
        //humain , algorithme ou IA (seul humain fonctionne por l'instant)
        //isplaying vaut true lorsque le worker calcule
        this.coups = 0;
        this.pref =pref;
        this.isplaying = false;
        this.player = "humain";
        this.firstPlayer = true;
        this.w = w;
        this.h = h;
        this.s = height/(this.h+3);
        this.x = width/2-(this.w/2)*this.s;
        this.y = height/2-(this.h/2)*this.s;
        this.click = false;
        this.turn = true;
        this.data = new Array(w);
        //à pour valeure l'ID du joueur gagnant (0 pour une partie en cours et 2 pour une égalité)
        this.winner = 0;
        //le tableau fall, c'est pour l'animation de chute
        this.fall = new Array(w);
        for(let i =0; i < w; i ++){
            this.data[i] = new Array(h);
            this.fall[i] = new Array(h);
        }
        console.log(this.data);
    }

    resize(width,height){
        this.s = height/(this.h+3);
        this.x = width/2-(this.w/2)*this.s;
        this.y = height/2-(this.h/2)*this.s;
    }

    show_grid(p){
        p.stroke(180);
        for(i =0; i <= this.w; i ++){
            p.line(this.x+this.s*i,this.y,this.x+this.s*i,this.y+this.h*this.s);
        }
        for(i =0; i <= this.h; i ++){
            p.line(this.x,this.s*i+this.y,this.x+this.s*this.w,this.y+i*this.s);
        }

        let Mx,My;
        Mx = p.mouseX;
        My = p.mouseY;
        let C = this.MouseToTile(Mx,My);
        //si la grille est remplie:
        if(this.coups == 42){
            this.winner = 2;
        }
        //si c'est à un algorithme de jouer
        if(!this.turn && this.player =="algorithme" && !this.isplaying && this.winner == 0){
            //on envoie un message au worker
            minimaxCalculator.postMessage([this.data,AIlevel*2,AIlevel,-1,1]);
            this.isplaying = true;
        }else{
            //sinon c'est à un humain de jouer donc on teste le curseur
            out:if(C[0] != -1 && C[1] != -1 && this.winner == 0){
                p.fill(240,50);
                p.rect(this.x+this.s*C[0],this.y+this.s*C[1],this.s,this.s);
                p.rect(this.x+this.s*C[0],this.y,this.s,this.s*this.h);
                
                if(p.mouseIsPressed && !this.click){
                    let col = this.getLowerEmpty(C[0]);
                    if(col != -1){
                        this.coups += 1;
                        if(this.turn){
                            this.data[C[0]][col] = 1;
                            this.fall[C[0]][col] = p.millis();
                            console.log(this.data);
                            extractor.game.push(Array.from(playGrid.data));
                            this.checkAlign(C[0],col,1);
                        }else{
                            //le joueur 2 peut jouer uniquement si l'adversaire est un humain
                            if(this.player == "humain"){
                                this.data[C[0]][col] = -1;
                                this.fall[C[0]][col] = p.millis();
                                console.log(this.data);
                                extractor.game.push(Array.from(this.data));
                                this.checkAlign(C[0],col,-1);
                            }else{
                                break out;
                            }
                        }
                        
                        this.turn = !this.turn;
                    }
                    this.click = !this.click;
                }
            }
        }
        
        if(p.mouseIsPressed && !this.click){
            this.click = !this.click;
        }
        if(this.click && !p.mouseIsPressed){
            this.click = !this.click;
        }
        p.noStroke();
        //console.log(p.millis()-this.fall[0][0]);
        for(let i=0; i < this.w; i++){
            for(let j=0; j < this.h; j++){
                let pY = 0;
                if(this.fall[i][j] != undefined){
                    pY = this.y-this.s+(p.millis()-this.fall[i][j])*this.h*this.s*(1/120);
                }
                if(pY > this.y+this.s*(j+0.5)){
                    pY = this.y+this.s*(j+0.5);
                }
                if(this.data[i][j] > 0){    
                   
                    p.fill(255,0,0);         
                    //+this.y+this.s*(j+0.5)
                    p.ellipse(this.x+this.s*(i+0.5),pY,this.s*0.9,this.s*0.9);
                    
                }else if(this.data[i][j] < 0){
                    p.fill(0,255,0);
                    p.ellipse(this.x+this.s*(i+0.5),pY,this.s*0.9,this.s*0.9);
                }
                if(p.abs(this.data[i][j]) == 2){
                    p.fill(255,150);        
                    p.ellipse(this.x+this.s*(i+0.5),pY,this.s*0.9,this.s*0.9); 
                }
            }
        }
        p.textAlign(p.CENTER,p.CENTER);
        p.textSize(20);
        p.fill(230);
        if(this.winner != 0){
            if(this.winner == 1){
                p.text("Le joueur 1 a gagne !!",this.x+this.s*this.w*0.5,this.y-this.s);
            }else if(this.winner == -1){
                p.text("Le joueur 2 a gagne !!",this.x+this.s*this.w*0.5,this.y-this.s);
            }else{
                p.text("egalite ...",this.x+this.s*this.w*0.5,this.y-this.s);
            }
        }else{
            if(this.turn){
                p.text("C'est au joueur 1 de jouer",this.x+this.s*this.w*0.5,this.y-this.s);
            }else{
                let points = "";
                if(this.player == "algorithme"){
                    for(i = 0; i < (p.millis()/400) % 4; i++){
                        points += ".";
                    }
                }
                p.text("C'est au joueur 2 de jouer "+points,this.x+this.s*this.w*0.5,this.y-this.s);
            }
        }

        
    }
    //faire jouer un coup (pour les algo et les IA)
    play(col){
        let pos = this.getLowerEmpty(col);
        if(pos != -1){
            this.coups += 1;
            if(this.turn){
                this.data[col][pos] = 1;
                this.fall[col][pos] = this.pref.millis();
                extractor.game.push(Array.from(playGrid.data));
                this.checkAlign(col,pos,1);
            }else{
                this.data[col][pos] = -1;
                this.fall[col][pos] = this.pref.millis();
                extractor.game.push(Array.from(playGrid.data));
                this.checkAlign(col,pos,-1);
            }
            this.turn = !this.turn;
        }
        this.isplaying = false;
    }
    
    
    checkAlign(x,y,t){
        let streak = 0;
        for(let i = x-3; i <= x+3; i++){
            if(i >= this.w){
                break;
            }
            if(i >= 0){
                streak += 1
                if(this.data[i][y] != t){
                    streak = 0;
                }
                if(streak == 4){
                    for(let j = 0; j < 4; j++){
                        this.data[i-j][y] = 2*t;
                        
                    }
                    this.winner = t;
                    emit_extractor(t,this.coups);
                    return;
                }
            }
        }
        streak = 0;
        for(let i = y-3; i <= y+3; i++){
            if(i >= this.h){
                break;
            }
            if(i >= 0){
                streak += 1
                if(this.data[x][i] != t){
                    streak = 0;
                }
                if(streak == 4){
                    for(let j = 0; j < 4; j++){
                        this.data[x][i-j] = 2*t;
                        console.log(Math.abs(2*t));
                    }
                    this.winner = t;
                    emit_extractor(t,this.coups);
                    return;
                }
            }
        }
        streak = 0;
        for(let i = -3; i <= 3; i++){
            if(x+i >= this.w || y+i >= this.h){
                break;
            }
            if(x+i >= 0 && y+i >= 0){
                streak += 1
                if(this.data[x+i][y+i] != t){
                    streak = 0;
                }
                if(streak == 4){
                    for(let j = 0; j < 4; j++){
                        this.data[x+i-j][y+i-j] = 2*t;
                        
                    }
                    this.winner = t;
                    emit_extractor(t,this.coups);
                    return;
                }
            }
        }
        streak = 0;
        for(let i = -3; i <= 3; i++){
            if(x+i >= this.w || y-i < 0){
                break;
            }
            if(x+i >= 0 && y-i < this.h){
                streak += 1
               
                if(this.data[x+i][y-i] != t){
                    streak = 0;
                }
                if(streak == 4){
                    for(let j = 0; j < 4; j++){
                        this.data[x+i-j][y-i+j] = 2*t;
                    }
                    this.winner = t;
                    emit_extractor(t,this.coups);
                    return;
                }
            }
        }
    }
    reset(){
        this.winner = 0;
        this.turn = this.firstPlayer;
        for(let i=0; i < this.w; i++){
            for(let j=0; j < this.h; j++){
                this.data[i][j] = 0;
            }
        }
        this.coups = 0;
        reset_extractor();
    }

    getLowerEmpty(x){
        for(let i = 0; i < this.h; i ++){
            if(this.data[x][i] != 0 && this.data[x][i] != undefined){
                return(i-1);
            }
        }
        return(this.h-1);
    }

    MouseToTile(x,y){
        let caseX = Math.floor((x-this.x)/this.s);
        if(caseX < 0 || caseX >= this.w){
            caseX = -1;
        }
        let caseY = Math.floor((y-this.y)/this.s);
        if(caseY < 0 || caseY >= this.h){
            caseY = -1;
        }
        return([caseX,caseY]); 
    }
    
    //E permet de garder en mémoire qui est l'adversaire car il est nescéssaire de le rendre moins intelligent que l'IA
    //minimax part toujours du principe que c'est le joueur 2 qui joue
    //pour simplifier les calculs, l'adversaire sera calculé toujours en max, on multplie par -1 à chaque étage 
    minimax(data,power,Epower,player,E){
        let prevision;
        let stat = Array(7);
        for(let i = 0; i < 7; i ++){
            let y = getLowerEmpty(i);
            stat[i] = 0;
            if((E == player && Epower > 0) ||(E!=player && power > 0)){
                if(y == -1){
                    stat[i] = -1000;
                    continue;
                }
                prevision = Array.from(data);
                prevision[getLowerEmpty(i)] = player;
                if(detectAlign(x,y,player)){
                    stat[i] = 100;
                    continue;
                }else{
                    stat[i] = -1*minimax(prevision,power-1,Epower-1,-1*player,E)[0];
                }
            }else{
                stat[i] = p.random(50);
            }
        }
        return(Math.max(stat),stat.indexOf(Math.max(stat)));
    }

    test(){
        return("loul");
    }

}


let C4 = function(p) {

    var canvas;
    var parent;
    let W,H;
    let pixd = 1;
    loul = 120;
    p.setup = function(){

        canvas= p.createCanvas(100, 100);
        
        canvas.parent("game");
        
        parent= document.getElementById("game");
        console.log(parent);
        W=parent.offsetWidth;
        H=parent.offsetHeight;
        console.log(H);
        console.log(W);
        p.resizeCanvas(W,H);
        canvas.style("");
        playGrid = new grid(W,H,7,6,p);
        playGrid.reset();
        reset_extractor();
        p.noSmooth();
        p.textFont(p.loadFont('fonts/Medel.ttf'));
    }


    p.draw = function(){
        
        //regulateur de résolution en fonction du nombre de FPS
        if(pixd == 0 && p.frameRate() < 10 && p.frameRate() > 3){
            pixd = 1;
            p.pixelDensity(1);
            console.log("medium");
        }
        if(pixd == 1 && p.frameRate() > 40){
            pixd = 0;
            p.pixelDensity(1.2);
            console.log("high");
        }
        if(pixd == 1 && p.frameRate() < 10 && p.frameRate() > 3){
            pixd = 2;
            p.pixelDensity(0.8);
            console.log("low");
        }
        if(pixd == 2 && p.frameRate() > 40){
            pixd = 1;
            p.pixelDensity(1);
            console.log("medium");
        }
        W=parent.offsetWidth;
        H=parent.offsetHeight;
        if(H != p.height){
            playGrid.resize(W,H);
        }
        p.resizeCanvas(W,H);
        red=0;
        p.background(red,loul,100,0);
        loul += p.random(40)-20;
        if(loul > 255){

            loul = 255;
        }
        if(loul < 0){
            loul = 0;
        }
        p.fill(255);
        playGrid.show_grid(p);
        //p.text(p.frameRate(),10,10);
    }

}



let connect4 = new p5(C4);