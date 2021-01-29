/*
-@author: John Anchery <GreekNio@gmail.com>
-@version: v1.0
-@date: 2021-01-16(UTC)
-------------------------------------------
* Copyright 2021 (C) John Anchery - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written by John Anchery <GreekNio@gmail.com>, 2021-01-16(UTC)
-------------------------------------------
*/

var dimensions = {x:5, y:5};
var scores = {player:0, opponent:0};
var taken = [];
var player = "Y";
var opponent = "C";
var nowPlaying = "Y";
var lines = [];

String.prototype.replaceAt = function(index, replacement){return this.substr(0, index) + replacement + this.substr(index + replacement.length);}
Array.prototype.min = function(){return Math.min.apply(null, this);}
function draw(){
	const board = document.createElement('div');
	board.id = 'board';
	document.getElementById('game').appendChild(board);
	for(var i = 1; i <= dimensions.y*2;) {
		for(var j = 1; j <= dimensions.x-1; j++) {
			dot = document.createElement('button');
			dot.className = "dot";
			board.appendChild(dot);

			side = document.createElement('button');
			side.className = "hside";
			side.innerHTML = " ";
			side.id = "HS-"+j+"x"+i+"y";
			side.addEventListener("click", fix_move);
			board.appendChild(side);
			lines.push(side.id);
		}
		dot = document.createElement('button');
		dot.className = "dot";
		board.appendChild(dot);

		board.appendChild(document.createElement('br'));
		i++;

		if(i == dimensions.y*2){break;}

		for(var j = 1; j <= dimensions.x-1; j++){
			side = document.createElement('span');
			side.className = "vside";
			side.id = "VS-"+j+"x"+i+"y";
			side.addEventListener("click", fix_move);
			board.appendChild(side);
			lines.push(side.id);

			insquare = document.createElement('button');
			insquare.className = "insquare";
			insquare.innerHTML = " ";
			insquare.id = "Q-" + j+"x" + i+"y";
			board.appendChild(insquare);
		}
		side = document.createElement('span');
		side.className = "vside";
		side.id = "VS-"+j+"x"+i+"y";
		side.addEventListener("click", fix_move);
		board.appendChild(side);
		lines.push(side.id);

		board.appendChild(document.createElement('br'));
		i++;
	}
	board.style.top = (208-((dimensions.y*60)/2))+'px';
	board.style.bottom = (208-((dimensions.y*60)/2))+'px';
}
function resetScore(){
	scores.player = 0;
	scores.opponent = 0;
	taken = [];
	lines = [];
}
function clearBoard(){
	document.getElementById('board').remove();
}
function redraw() {
	dimensions.x = document.getElementById('xdimension').value;
	dimensions.y = document.getElementById('ydimension').value;
	player = document.getElementById('tag').value;
	nowPlaying = player;
	resetScore();
	clearBoard();
	draw();
}
function getx(str){return parseInt(str.substring(str.indexOf("-") + 1, str.indexOf("x")));}
function gety(str){return parseInt(str.substring(str.indexOf("x") + 1, str.length-1));}
function change(str, nxval, nyval){str = str.replace((gety(str)+"y"), (nyval+"y"));return str.replace((getx(str)+"x"), (nxval+"x"));}
function toSquare(str){return str.replace((str.substring(0, 2)), "Q");}
function switchTurn(){
	if(nowPlaying == player){
		nowPlaying = opponent;
	}
	else{
		nowPlaying = player;
	}
}
function addScore(){
	if(nowPlaying == player){
		scores.player++;
	}
	else{
		scores.opponent++;
	}
}
function get_spotlight(spot){
	const arr = [];

	if (spot.charAt(0) == "V"){
		arr.push((change(spot, getx(spot)-1, gety(spot)-1)).replaceAt(0, "H"));
		arr.push(change(spot, getx(spot)-1, gety(spot)));
		arr.push((change(spot, getx(spot)-1, gety(spot)+1)).replaceAt(0, "H"));
		arr.push(spot);
		arr.push((change(spot, getx(spot), gety(spot)-1)).replaceAt(0, "H"));
		arr.push(change(spot, getx(spot)+1, gety(spot)));
		arr.push((change(spot, getx(spot), gety(spot)+1)).replaceAt(0, "H"));
	}
	if (spot.charAt(0) == "H"){
		arr.push(change(spot, getx(spot), gety(spot)-2));
		arr.push((change(spot, getx(spot), gety(spot)-1)).replaceAt(0, "V"));
		arr.push((change(spot, getx(spot)+1, gety(spot)-1)).replaceAt(0, "V"));
		arr.push(spot);
		arr.push((change(spot, getx(spot), gety(spot)+1)).replaceAt(0, "V"));
		arr.push((change(spot, getx(spot)+1, gety(spot)+1)).replaceAt(0, "V"));
		arr.push(change(spot, getx(spot), gety(spot)+2));
	}

	const max_y = (dimensions.y-1)+dimensions.y;
	const othery = (dimensions.y-2)+dimensions.y;

	const res = [];

	for (let i=0; i < arr.length; i++){
		if (getx(arr[i]) < 1){continue;}
		if (gety(arr[i]) < 1){continue;}

		if (arr[i].charAt(0) == "H"){
			if (getx(arr[i]) > dimensions.x-1){continue;}
			if (gety(arr[i]) > max_y){continue;}
		}
		else{
			if (getx(arr[i]) > dimensions.x){continue;}
			if (gety(arr[i]) > othery){continue;}
		}
		res.push(arr[i]);
	}
	delete arr;
	return res;
}
function gameOver(){
	clearBoard();
	board = document.createElement('div');
	board.id = 'board';
	board.className = "end-msg";
	board.style.top = "150px";
	
	msg = "You lost the game";
	if(scores.player > scores.opponent){
		msg = "You won the game";
	}
	if(scores.player == scores.opponent){
		msg = "It's a draw";
	}
	board.innerHTML = msg;
	
	board.appendChild(document.createElement('br'));
	
	playAgain = document.createElement('button');
	playAgain.innerHTML = "Play Again";
	playAgain.className = "play-again";
	playAgain.addEventListener("click", redraw);
	board.appendChild(playAgain);
	
	document.getElementById('game').appendChild(board);
}
function fix_move(){
	if (taken.includes(this.id)){return false;}

	const index = lines.indexOf(this.id);
	if (index > -1) {lines.splice(index, 1);}

	if(nowPlaying == player){
		this.style.background = "#9554D6";
	}
	else{
		this.style.background = "#338AF5";
	}
	taken.push(this.id);
	let square = isFull(this.id);
	let succuss = false;

	for(let i=0; i < square.length; i++){
		document.getElementById(square[i]).innerHTML = nowPlaying;
		addScore();
		succuss = true;
	}
	if(lines.length == 0){
		gameOver();
	}

	if(succuss){
		if(nowPlaying == opponent){
			computer.play(this.id);
			return;
		}
		else{
			return;
		}
	}
	else{
		if(nowPlaying == opponent){
			switchTurn();
			return;
		}
		else{
			switchTurn();
			computer.play(this.id);
			return;
		}
	}
	return;
}
function isFull(spot){
	let proto_Full = get_spotlight(spot);
	var toFull_a = [];
	var toFull_b = [];


	if (proto_Full.length == 7){
		toFull_a = (proto_Full.slice(0, 4));
		toFull_b = (proto_Full.slice(3, 7));
	}
	else{toFull_b = (proto_Full);}

	var arr = [];
	var res = [];

	for(let i=0; i < toFull_a.length; i++){
		if(taken.indexOf(toFull_a[i]) == -1){arr.push(false);}
		else{arr.push(true);}
	}
	if(!(toFull_a.length == 0)){
		if(arr.every(function(i){return i;})){
			res.push(toSquare(toFull_a[1]));
		}
	}
	arr = [];

	for(let i=0; i < toFull_b.length; i++){
		if(taken.indexOf(toFull_b[i]) == -1){arr.push(false);}
		else{arr.push(true);}
	}
	if(arr.every(function(i){return i;})){
		let n = 0;
		if(toFull_b[0].charAt(0)=="H"){
			n=1;
		}
		res.push(toSquare(toFull_b[n]));
	}
	return res;
}
var computer = {
	/*Squarz AI*/
	splitSquare: function(arr){
		var moveToConquer_a = [];
		var moveToConquer_b = [];

		if (arr.length == 7){
			moveToConquer_a = (arr.slice(0, 4));
			moveToConquer_b = (arr.slice(3, 7));
		}
		else{moveToConquer_b = (arr);}

		moveToConquer_a = computer.removeTaken(moveToConquer_a);
		moveToConquer_b = computer.removeTaken(moveToConquer_b);

		res = [];
		if(moveToConquer_a.length == 1){
			res.push(moveToConquer_a[0]);
		}
		if(moveToConquer_b.length == 1){
			res.push(moveToConquer_b[0]);
		}
		return res;
	},
	removeTaken: function(set){
		let res = [];
		for(let i = 0; i < set.length; i++){
			if(!(taken.includes(set[i]))){
				res.push(set[i]);
			}
		}
		return res;
	},
	randomFrom: function(set) {
		min = 0;
		max = set.length;
		randomVal = Math.floor(Math.random() * (max - min) + min);
		return set[randomVal];
	},
	whereConquer: function(set){
		res = [];
		for(let i = 0; i < set.length; i++){
			if(taken.includes(set[i])){
				continue;
			}
			else{
				taken.push(set[i]);
				if(isFull(set[i]).length > 0){
					res.push(set[i]);
				}
				taken.pop();
			}
		}
		return res;
	},
	play: function(spot){
		let possibilities = computer.whereConquer(lines);
		if(possibilities.length > 0){
			let move = document.getElementById(possibilities[0]);
			move.click();
			return;
		}
		else{
			possibilities = [];
			for(let i = 0; i < lines.length; i++){
				taken.push(lines[i]);
				if((computer.splitSquare(get_spotlight(lines[i]))).length == 0){
					possibilities.push(lines[i]);
				}
				taken.pop();
			}
			if(possibilities.length > 0){
				let move = document.getElementById(computer.randomFrom(possibilities));
				move.click();
				return;
			}
			else{
				let move = document.getElementById(computer.randomFrom(lines));
				move.click();
				return;
			}
		}
	}
}