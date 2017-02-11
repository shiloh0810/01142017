var FPS = 60;
// 創造 img HTML 元素，並放入變數中
var bgImg = document.createElement("img");
var enemyImg = document.createElement("img");
var buttonImg = document.createElement("img");
var defenseImg = document.createElement("img");

// 設定這個元素的要顯示的圖片
bgImg.src = "images/map.png";
enemyImg.src = "images/slime.gif";
buttonImg.src = "images/tower-btn.png";
defenseImg.src = "images/tower.png";

// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");

// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");
var newX;

function draw(){
  enemy.move();
  // 將背景圖片畫在 canvas 上的 (0,0) 位置
  ctx.drawImage(bgImg,0,0);
  ctx.drawImage(enemyImg,enemy.x,enemy.y);
  ctx.drawImage(buttonImg,640-80,480-80,80,80);
  if(isBuilding == true){

  	ctx.drawImage(defenseImg,cursor.x-cursor.x%32,cursor.y-cursor.y%32);

  }
  else
  {
  	ctx.drawImage (defenseImg, tower.x, tower.y)
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


var enemy = {
	x: 80,
	y : 0,
	speedX : 0,
	speedY : 64,
	pathDes: 0,
	move : function(){
		
		if(isCollided(enemyPath[this.pathDes].x, enemyPath[this.pathDes].y,
				this.x, this.y, 64/FPS, 64/FPS)){
			this.x=enemyPath[this.pathDes].x;
			this.y=enemyPath[this.pathDes].y;
			
			this.pathDes++;
			if(enemyPath[this.pathDes].y<this.y){
				//up
				this.speedX=0;
				this.speedY=-64;
			}else if(enemyPath[this.pathDes].x>this.x){
				//right
				this.speedX=64;
				this.speedY=0;
			}else if(enemyPath[this.pathDes].y>this.y){
				//down
				this.speedX=0;
				this.speedY=64;
			}else{
				//left
				this.speedX=-64;
				this.speedY=0;
			}
		}else{
			this.x += this.speedX/FPS;
			this.y += this.speedY/FPS;
		}
	}
}

var cursor = {
	x: 0,
	y : 0,
}
var tower = {
	x: 0,
	y: 0,
}

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
			tower.x = cursor.x-cursor.x%32;
			tower.y = cursor.y-cursor.y%32;
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
// 執行 draw 函式
setInterval(draw, 1000/FPS);