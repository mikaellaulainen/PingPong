var canvas = document.getElementById('canvas');
//Saa näkymään contextin eli sisällön 2d:nä
var ctx = canvas.getContext('2d');

window.onload = function init() {
  var game = new GF();
  
  game.start();
  
};
var GF= function() {
  var pallo= new Pallo(200,150,20,"#33cc33");
  var maila= new Maila(240,550,150,10,"#FF0000");
  var vihollinen= new Vihollinen(240,15,150,10,"black");
  var leftArrowPressed= false;
  var rightArrowPressed=false;
  var vihollinenPisteet= 0;
  var mailaPisteet= 0;
  var cWidth= canvas.width;
  var cheight= canvas.height;
  const mailaan = new Audio('./sounds/pingpong.mp3');
  const maali= new Audio("./sounds/maali.mp3");

  var  mainLoop= function() {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    //Nappien alas painaminen
    function keyDownHandler(event) {
      // Näppäinkoodin saanti
      switch (event.keyCode) {
        // Vasen näppäin
        case 37:
          // Vasen totta
          leftArrowPressed = true;
          break;
        // oikea totta
        case 39:
          rightArrowPressed = true;
          break;
      }
    }

    // kun näppäin vapautetaan
    function keyUpHandler(event) {
      switch (event.keyCode) {
        // vasen
        case 37:
          leftArrowPressed = false;
          break;
        // oikea
        case 39:
          rightArrowPressed = false;
          break;
      }
    }
    piirraPeli(10,10);
    liikutaMaailmaa();
    requestAnimationFrame (mainLoop);
  }

  function Pallo(x,y,sade,vari) {
    this.x= x;
    this.y= y;
    this.vx= 1;
    this.vy= 2;
    this.sade= sade;
    this.vari= vari;

    this.piirra= function() {
      ctx.beginPath();
      ctx.fillStyle= this.vari;
      ctx.arc(this.x,this.y,this.sade,0,2*Math.PI);
      ctx.fill();
    };
    this.liiku= function() {
      this.x=this.x+this.vx;
      this.y=this.y+this.vy;
      //Kun pallo osuu reunaan vaihtaa suuntaa!
      if (this.x-10 <= 0 || this.x+this.sade+10 >= cWidth){
        this.vx*=-1;

      }
    }
  }

  function Maila(x,y,leveys,korkeus,vari) {
    this.x= x;
    this.y= y;
    this.vx= 4;
    this.leveys= leveys;
    this.korkeus=korkeus;
    this.vari= vari;

    this.piirra= function() {
      ctx.fillStyle=this.vari;
      ctx.fillRect(this.x,this.y,this.leveys,this.korkeus);
      ctx.fillStyle = 'black';
      ctx.font = '35px sans-serif';
      ctx.fillText(mailaPisteet, 550,550);
    };
    this.liiku= function() {
      this.x+=this.vx;
    }
  }
  function Vihollinen(x,y,leveys,korkeus,vari) {
    this.x= x;
    this.y= y;
    this.leveys= leveys;
    this.korkeus=korkeus;
    this.vari= vari;
    this.nopeus= 0.03;

    this.piirra= function() {
      ctx.fillStyle=this.vari;
      ctx.fillRect(this.x,this.y,this.leveys,this.korkeus);
      ctx.fillStyle = 'black';
      ctx.font = '35px sans-serif';
      ctx.fillText(vihollinenPisteet, 550, 50);
    }
    this.liiku = function() {
      if (pallo.x > 30   && pallo.x <530)
      vihollinen.x += ((pallo.x - (this.x + this.leveys / 2))) * this.nopeus;
    }
  }
  function piirraPeli(x,y) {
    ctx.clearRect(0,0,600,600);
    ctx.fillStyle="#ffaf40"
    ctx.fillRect(0,290,cWidth,10,"#ffaf40");
    ctx.save();
    ctx.translate(x,y);
    pallo.piirra();
    maila.piirra();
    vihollinen.piirra();
    vihollinen.liiku();
    osuikomailaan();
    osuikoviholliseen();
    pisteet();
    ctx.restore();
  };

  function liikutaMaailmaa() {
    pallo.liiku();
    if(leftArrowPressed &&maila.x > 0) {
      maila.vx= Math.abs(maila.vx)*-1;
      maila.liiku();
    }else if(rightArrowPressed && maila.x+maila.leveys+20 < cWidth) {
      maila.vx= Math.abs(maila.vx);
      maila.liiku();
    }
  };
  function osuikomailaan() {
    var testX=pallo.x;
    var testY= pallo.y;

    if(testX<maila.x) {
      testX=maila.x;
    } else if (testX > (maila.x+maila.leveys)) {
      testX=(maila.x+maila.leveys);
    }
    if(testY<maila.y) {
      testY=maila.y;
    } else if (testY > (maila.y+maila.korkeus)) {
      testY=(maila.y+maila.korkeus);
    }

    var distX= pallo.x-testX;
    var distY= pallo.y-testY;
    var dista= Math.sqrt((distX*distX)+(distY*distY));
    if(dista <= pallo.sade) {
      if ((pallo.x+(pallo.sade*2)) >= maila.x && ((pallo.y+(pallo.sade*2)) >= maila.y &&
      (pallo.y+pallo.sade) <=(maila.y+maila.korkeus)) && (pallo.x+(pallo.sade*2)) <= (maila.x+(maila.leveys/2))) {
        pallo.vx*=-1.1;
        pallo.vy*=-1.1;
        mailaan.play();
      }if ((pallo.x+(pallo.sade*2)) >= maila.x && ((pallo.y+(pallo.sade*2)) >= maila.y &&
      (pallo.y+pallo.sade) <=(maila.y+maila.korkeus)) && (pallo.x+(pallo.sade*2)) >= (maila.x+(maila.leveys/2))) {
        pallo.vx*=1.1;
        pallo.vy*=-1.1;
        mailaan.play();
      }
    }
  }
  function osuikoviholliseen() {
    var testX=pallo.x;
    var testY= pallo.y;

    if(testX<vihollinen.x) {
      testX=vihollinen.x;
    } else if (testX > (vihollinen.x+vihollinen.leveys)) {
      testX=(vihollinen.x+vihollinen.leveys);
    }
    if(testY<vihollinen.y) {
      testY=vihollinen.y;
    } else if (testY > (vihollinen.y+vihollinen.korkeus)) {
      testY=(vihollinen.y+vihollinen.korkeus);
    }

    var distX= pallo.x-testX;
    var distY= pallo.y-testY;
    var dista= Math.sqrt((distX*distX)+(distY*distY));
    if(dista <= pallo.sade) {
      if ((pallo.x) >= vihollinen.x && ((pallo.y-pallo.sade) <= (vihollinen.y+vihollinen.korkeus) &&
      (pallo.y) >= vihollinen.y) && (pallo.x+(pallo.sade*2))<= (vihollinen.x+(vihollinen.leveys/2))) {
        pallo.vx*=-1.1;
        pallo.vy*=-1.1;
        mailaan.play();
      }if ((pallo.x) >= vihollinen.x &&((pallo.y-pallo.sade) <= (vihollinen.y+vihollinen.korkeus) &&
      (pallo.y) >= vihollinen.y) && (pallo.x+(pallo.sade*2)) >= (vihollinen.x+(vihollinen.leveys/2))) {
        pallo.vx*=1.1;
        pallo.vy*=-1.1;
        mailaan.play();
      }
    }
  }
  function reset() {
    pallo.x = canvas.width / 2;
    pallo.y = canvas.height / 2;
    pallo.vx =2;
    pallo.vy = 2;
  }
  function pisteet() {
    if ((pallo.y+pallo.sade)>=600) {
      vihollinenPisteet++;
      maali.play();
      reset();
    }else if((pallo.y-pallo.sade)<=0) {
      mailaPisteet++;
      maali.play();
      reset();
      pallo.vy=-2;
      vihollinen.nopeus+=0.008;
    }
  }
  var start= function() {
    canvas= document.querySelector("canvas");

    ctx= canvas.getContext("2d");
    requestAnimationFrame(mainLoop);
  };
  
  return {
    start: start
  };
};