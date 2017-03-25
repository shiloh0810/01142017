var FPS = 60;
var clock = 0;
var hp = 100;
var con= true;
var money = 15;
var score = 0;
// 創造 img HTML 元素，並放入變數中
var bgImg = document.createElement("img");
var slimeImg = document.createElement("img");
var daighImg = document.createElement("img");
var jasonImg = document.createElement("img");
var rukiaImg = document.createElement("img");
var buttonImg = document.createElement("img");
var defenseImg = document.createElement("img");
var crossImg = document.createElement("img");
var goldImg = document.createElement("img");
var silverImg = document.createElement("img");
var bronzeImg = document.createElement("img");

// 設定這個元素的要顯示的圖片
bgImg.src = "images/map.png";
slimeImg.src = "images/slime.gif";
daighImg.src = "images/daigh.gif";
jasonImg.src = "images/jason.gif";
rukiaImg.src = "images/rukia.gif";
buttonImg.src = "images/tower-btn.png";
defenseImg.src = "images/tower.png";
crossImg.src = "images/crosshair.png";
goldImg.src = "images/gold.png";
silverImg.src = "images/silver.png";
bronzeImg.src = "images/bronze.png"

// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");

// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");
var newX;

function draw(){
  if(con)
  {
  	console.log(con)
  	clock++;
  	if(clock%80==0)
	  {
	  	var newEnemy= new Enemy();
	  	enemies.push(newEnemy);
	  }
	  // 將背景圖片畫在 canvas 上的 (0,0) 位置
	  ctx.drawImage(bgImg,0,0);
	  for(i=0; i<enemies.length; i++)
	  {
	  	if(enemies[i].hp<=0)
	  	{
	  		enemies.splice(i, 1);
	  		score += 10;
	  		money += 10;
	  	}
	  	else
	  	{
	  		enemies[i].move();
	  		ctx.drawImage(pic[enemies[i].picture],enemies[i].x,enemies[i].y);
	  	}
	  }
	  if(isBuilding){

	  	ctx.drawImage(defenseImg,cursor.x-cursor.x%32,cursor.y-cursor.y%32);

	  }
	  for(var i=0; i<towers.length; i++)
	  {
	  	towers[i].searchEnemy();
	  	ctx.drawImage (defenseImg, towers[i].x, towers[i].y)
	  	if(towers[i].aimingEnemyId!=null){
		  	var id = towers[i].aimingEnemyId;
		  	ctx.drawImage (crossImg, enemies[id].x, enemies[id].y)
		}
	  }
	  ctx.font="24px Arial";
	  ctx.fillStyle="white";
	  ctx.fillText("HP: "+hp, 10, 40);
	  ctx.fillText("Score: "+score, 10, 70);
	  ctx.fillText("Money: "+money, 10, 100);
	  ctx.drawImage(buttonImg,640-80,480-80,80,80);
  }
  if(hp <= 0)
  {
  	clearInterval(intervalID);
  	ctx.font="80px Arial";
  	ctx.fillStyle="red";
  	ctx.fillText("Game Over", 130, 200);
  	ctx.font="50px Arial";
  	ctx.fillText("You got", 250, 250);
  	ctx.fillText(score, 300, 300);
  	if(score>=200)
  	{
  		ctx.drawImage(goldImg, 330, 300);
  	}
  	else if(score>=100)
  	{
  		ctx.drawImage(silverImg, 330, 300);
  	}
  	else
  	{
  		ctx.drawImage(bronzeImg, 330, 300);
  	}
  } 
}

// 執行 draw 函式
var intervalID = setInterval(draw, 1000/FPS);

$("body").on("keypress", pause);
function pause(event)
{
	if(event.which == 112)
	{
		if(con){
			con=false;
		}
		else{
			con=true;
		}
	}
}

var enemyPath=[
	{x:80, y:0},
	{x: 80, y: 176},
	{x: 336, y: 176},
	{x: 336, y: 304},
	{x: 144, y: 304},
	{x: 144, y: 400},
	{x: 528, y: 400},
	{x: 528, y: 128},
]

var pic=[
	slimeImg,
	daighImg,
	jasonImg,
	rukiaImg,
]

function Enemy(){
	this.fast = 80+clock/20;
	this.x = 80;
	this.y = 0;
	this.speedX = 0;
	this.speedY = this.fast;
	this.pathDes = 0;
	this.picture = Math.floor((Math.random() * 4) + 0);
	this.hp=15;
	this.move = function(){
		
		if(isCollided(enemyPath[this.pathDes].x, enemyPath[this.pathDes].y,
				this.x, this.y, this.fast/FPS, this.fast/FPS)){
			//移動
			this.x=enemyPath[this.pathDes].x;
			this.y=enemyPath[this.pathDes].y;
			//指定
			this.pathDes++;
			if(this.pathDes==enemyPath.length)
			{
				this.hp=0;
				hp-=10;
				return;
			}
			//計算，修改
			if(enemyPath[this.pathDes].y<this.y){
				//up
				this.speedX=0;
				this.speedY= -this.fast;
			}else if(enemyPath[this.pathDes].x>this.x){
				//right
				this.speedX=this.fast;
				this.speedY=0;
			}else if(enemyPath[this.pathDes].y>this.y){
				//down
				this.speedX=0;
				this.speedY=this.fast;
			}else{
				//left
				this.speedX=-this.fast;
				this.speedY=0;
			}
		}else{
			this.x += this.speedX/FPS;
			this.y += this.speedY/FPS;
		}
	}
}

var enemies = [];

var cursor = {
	x: 0,
	y : 0,
}

function Tower(){
	this.x = 0;
	this.y = 0;
	this.range = 96;
	this.aimingEnemyId = null;
	this.searchEnemy = function(){
	this.readyToShootTime -= 1/FPS;
	for(var i=0; i<enemies.length; i++){
		var distance = Math.sqrt(Math.pow(this.x-enemies[i].x,2) + Math.pow(this.y-enemies[i].y,2));
		if (distance<=this.range) {
			this.aimingEnemyId = i;
			if(this.readyToShootTime<=0)
			{
				this.shoot(i);
				if(this.readyToShootTime <= -1)
				{
					this.readyToShootTime=this.fireRate;
				}
			}
			return;
		}
	}
	// 如果都沒找到，會進到這行，清除鎖定的目標
	this.aimingEnemyId = null;
	};
	this.shoot = function(id){
		ctx.beginPath();
		ctx.moveTo(this.x+10, this.y+20);
		ctx.lineTo(enemies[id].x+10, enemies[id].y);
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 8;
		ctx.stroke();
		enemies[id].hp -= this.damage;
	};
	this.fireRate = 1;
	this.readyToShootTime = 1;
	this.damage = 5;	
}

var towers=[];

$("#game-canvas").on("mousemove", mousemove);
$("#game-canvas").on("click", click);
var isBuilding = false;

function click(){
	if (cursor.x >= (640-80) && cursor.y >= (480-80)){
		isBuilding = true;
	}else{
		//蓋塔
		if(isBuilding)
		{
			if(money>=15)
			{
				var newTower = new Tower();
				newTower.x = cursor.x-cursor.x%32;
				newTower.y = cursor.y-cursor.y%32;
				towers.push(newTower);
				money -= 15;
			}
		}
		isBuilding = false; //建造完成
	}
}

function mousemove(event){
	cursor.x = event.offsetX;
	cursor.y = event.offsetY;
}

function isCollided(pointX, pointY, targetX, targetY, targetWidth, targetHeight){
	if(targetX<=pointX && pointX<=targetX+targetWidth 
		&& targetY<=pointY && pointY<=targetY+targetHeight){
		return true;
	}else{
		return false;
	}
}