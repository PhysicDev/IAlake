function detectAlign(data,x,y,t){
    let streak = 0;
    for(let i = x-3; i <= x+3; i++){
        if(i >= 7){
            break;
        }
        if(i >= 0){
            streak += 1
            if(data[i][y] != t){
                streak = 0;
            }
            if(streak == 4){
                return true;
            }
        }
    }
    streak = 0;
    for(let i = y-3; i <= y+3; i++){
        if(i >= 6){
            break;
        }
        if(i >= 0){
            streak += 1
            if(data[x][i] != t){
                streak = 0;
            }
            if(streak == 4){
                return true;
            }
        }
    }
    streak = 0;
    for(let i = -3; i <= 3; i++){
        if(x+i >= 7 || y+i >= 6){
            break;
        }
        if(x+i >= 0 && y+i >= 0){
            streak += 1
            if(data[x+i][y+i] != t){
                streak = 0;
            }
            if(streak == 4){
                return true;
            }
        }
    }
    streak = 0;
    for(let i = -3; i <= 3; i++){
        if(x+i >= 7 || y-i < 0){
            break;
        }
        if(x+i >= 0 && y-i < 6){
            streak += 1
           
            if(data[x+i][y-i] != t){
                streak = 0;
            }
            if(streak == 4){
                return true;
            }
        }
    }
    return false
}

function getLowerEmpty(data,x){
    for(let i = 0; i < 6; i ++){
        if(data[x][i] != 0 && data[x][i] != undefined){
            return(i-1);
        }
    }
    return(6-1);
}

function minimax(data,power,Epower,player,E){
  
    let prevision = Array(7);
    let stat = [0,0,0,0,0,0,0];
    let multiple = E*player*-1;
    //console.log(multiple,player);
    for(let i = 0; i < 7; i ++){
        let y = getLowerEmpty(data,i);
        stat[i] = 0;
        if(power > 0){
            if(y == -1){
                stat[i] = -1000*multiple;
                continue;
            }
            for(let i = 0; i < 7; i ++){
                prevision[i] = Array.from(data[i]);
            }

            prevision[i][y] = player;
            //console.log(player);
            if(detectAlign(prevision,i,y,player)){
               // console.log("AAAAAAAAAAAAAAAAAAAAAAAAA");
                stat[i] = 100*multiple;
                break;
            }else{
                stat[i] = minimax(prevision,power-1,Epower-1,-1*player,E)[0];
            }
        }else{
            stat[i] = Math.round(Math.random()*40)*multiple;
        }
    }
    if(E!=player){
        //  console.log([stat,Math.max(...stat),stat.indexOf(Math.max(...stat))]);
        return([Math.max(...stat),stat.indexOf(Math.max(...stat))]);
    }else{
        //console.log([stat,Math.max(...stat),stat.indexOf(Math.max(...stat))]);
        if(Epower > 0){
            return([Math.min(...stat),stat.indexOf(Math.min(...stat))]);
        }else{
            let div = 7;
            let sum =0;
            for(let i = 0; i < 7; i++){
                if(Math.abs(stat[i])!=1000){
                    sum += stat[i];
                }else{
                    div -= 1;
                }
            }
            
            if(div == 0){
                console.log("END");
                div = 1;
            }
            return([Math.round(sum/div),0]);
        }
        
    }
}

//secret : (440zooxynxrnqqunqtwzruppo02/*%#4on3%#2%4n0(0
//un cryptage de l'antiquité sur un message pouvant uniquement être compris par des gens du 21eme siècle 

self.onmessage = function(e) {
    console.log('Calcul du coup : minimax de profondeur : '+e.data[1]+'\n grille d\'entrée : '+e.data[0])
    choix = 0;
    choix = minimax(e.data[0],e.data[1],e.data[2],-1,1); 
    console.log("pourcentage de victoire algorithme : ",(choix[0]+100)/2,"%\n coup en colonne :",choix[1])
    postMessage(choix[1]);
}

