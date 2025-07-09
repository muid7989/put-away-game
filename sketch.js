let time;
let frameCountBuffer = 0;
let fps = 0;

const CANVAS_W = 960;
const CANVAS_H = 600;

const BUTTON_W = CANVAS_W/5;
const BUTTON_H = 100;
const BUTTON_M = 30;
const BUTTON_Y = CANVAS_H;

const GRID_SIZE = 64;
const GRID_BASE_X = 100;
const GRID_BASE_Y = 100;
const GRID_X = 12;
const GRID_Y = 8;
const PLAYER_SIZE = 56;
const ITEM_SIZE = 48;
const ITEM_NUM = 4;

const TARGET_SIZE = 60;

let upButton, downButton, leftButton, rightButton;
let getButton;
let startButton;
let startFlag = false;
let startTime;
let endTime = 0;
let player;
let items;
let targetPos;

let timeCount;
const TEXT_VIEW_SIZE = 32;

const DEBUG_VIEW_X = 20;
const DEBUG_VIEW_Y = 20;
const DEBUG_VIEW_H = 20;

function preload() {
}
function playerMove(x, y){
	player.pos.x += x;
	if (player.pos.x<0){
		player.pos.x = 0;
	}else if (player.pos.x>=GRID_X){
		player.pos.x = GRID_X-1;
	}
	player.pos.y += y;
	if (player.pos.y<0){
		player.pos.y = 0;
	}else if (player.pos.y>=GRID_Y){
		player.pos.y = GRID_Y-1;
	}
	if ((player.pos.x==targetPos.x) && (player.pos.y==targetPos.y)){
		items[player.getIndex].enable = false;
		player.getIndex = null;
		player.getNum++;
		if (player.getNum>=ITEM_NUM){
			startButton.show();
			endTime = (millis() - startTime)/1000;
			startFlag = false;
		}
	}
}
function upFn() {
	playerMove(0, -1);
}
function downFn() {
	playerMove(0, 1);
}
function leftFn() {
	playerMove(-1, 0);
}
function rightFn() {
	playerMove(1, 0);
}
function getFn() {
	for (let i=0; i<items.length; i++){
		if (items[i].enable){
			if ((player.pos.x==items[i].pos.x) && (player.pos.y==items[i].pos.y)){
				player.getIndex = i;
				items[i].pos = player.pos;
				break;
			}
		}
	}
}
function startFn() {
	startFlag = true;
	startTime = millis();
	startButton.hide();
	player.getNum = 0;
	items = [];
	for (let i=0; i<ITEM_NUM; i++){
		items[i] = {};
		items[i].pos = {};
		items[i].pos.x = i*2+1;
		items[i].pos.y = int(random(8));
		items[i].enable = true;
	}
}
function setup() {
	createCanvas(CANVAS_W, CANVAS_H);
	time = millis();

	player = {};
	player.pos = {};
	player.pos.x = 0;
	player.pos.y = 0;
	items = [];
	targetPos = {};
	targetPos.x = 0;
	targetPos.y = 7;
	rectMode(CENTER);

	getButton = buttonInit('get', getFn, BUTTON_W, BUTTON_H, 0, BUTTON_Y);
	upButton = buttonInit('↑', upFn, BUTTON_W, BUTTON_H, BUTTON_W*1, BUTTON_Y);
	downButton = buttonInit('↓', downFn, BUTTON_W, BUTTON_H, BUTTON_W*2, BUTTON_Y);
	leftButton = buttonInit('←', leftFn, BUTTON_W, BUTTON_H, BUTTON_W*3, BUTTON_Y);
	rightButton = buttonInit('→', rightFn, BUTTON_W, BUTTON_H, BUTTON_W*4, BUTTON_Y);
	startButton = buttonInit('start', startFn, BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W)/2, 200);
}
function buttonInit(text, callback, w, h, x, y) {
	let button = createButton(text);
	button.mouseClicked(callback);
	button.size(w,h);
	button.position(x,y);
	button.style('font-size', '32px');
	return button;
}
function draw() {
	background('blue');
	let current = millis();
	if ( (current-time)>=1000 ){
		time += 1000;
		fps = frameCount - frameCountBuffer;
		frameCountBuffer = frameCount;
	}
	stroke(255);
	strokeWeight(3);
	noFill();
	rect(GRID_BASE_X+GRID_SIZE*player.pos.x, GRID_BASE_Y+GRID_SIZE*player.pos.y, PLAYER_SIZE);
	for (let i=0; i<items.length; i++){
		if (items[i].enable){
			strokeWeight(1);
			stroke(255);
			fill('red');
			if (player.getIndex==i){
				strokeWeight(6);
				stroke('pink');
			}
			rect(GRID_BASE_X+GRID_SIZE*items[i].pos.x, GRID_BASE_Y+GRID_SIZE*items[i].pos.y, ITEM_SIZE);	
		}
	}
	strokeWeight(2);
	stroke('red');
	noFill();
	rect(GRID_BASE_X+GRID_SIZE*targetPos.x, GRID_BASE_Y+GRID_SIZE*targetPos.y, TARGET_SIZE);

	if (startFlag==false){
		fill(255);
		stroke(255);
		textSize(64);
		textAlign(CENTER);
		text(endTime.toFixed(1)+' sec', CANVAS_W/2, 128);
	}
	fill(255);
	stroke(255);
	textSize(16);
	strokeWeight(1);
	let debugY = DEBUG_VIEW_Y;
	text('fps:'+fps, DEBUG_VIEW_X, debugY);
	debugY += DEBUG_VIEW_H;
}
