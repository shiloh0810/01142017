// 創造 img HTML 元素，並放入變數中
var bgImg = document.createElement("img");
var enemyImg = document.createElement("img");
var buttonImg = document.createElement("img");
var defenseImg = document.createElement("img");

// 設定這個元素的要顯示的圖片
bgImg.src = "images/map.png";
enemyImg.src = "images/rukia.gif";
buttonImg.src = "images/tower-btn.png";
defenseImg.src = "images/tower.png";

// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");

// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

function draw(){
	// 將背景圖片畫在 canvas 上的 (0,0) 位置
  ctx.drawImage(bgImg,0,0);
  ctx.drawImage(enemyImg,enemy.x,enemy.y);
  ctx.drawImage(buttonImg,640-80,480-80,80,80);
  ctx.drawImage(defenseImg,cursor.x,cursor.y);
  
}

var enemy = {
	x: 96,
	y : 480 - 32,
}

var cursor = {
	x: 0,
	y : 0,
}

$("#game-canvas").on("mousemove", mousemove);
function mousemove(event){
	cursor.x = event.offsetX;
	cursor.y = event.offsetY;
}
// 執行 draw 函式
setInterval(draw, 16);