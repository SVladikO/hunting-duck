// The last coordinate
var	lastLeft  = [0,0,0,0,0];
var	lastTop   = [0,0,0,0,0];

// Start coordinate goals 
var	goalsStartLeft = [0,0,0,0,0];
var	goalsStartTop  = [0,0,0,0,0];

var	goalsId = ['#goal1','#goal2','#goal3','#goal4','#goal5'];

// Filling coordinate 
function setXY(){
	for (var i = 0; i < goalsId.length; i++) {
		goalsStartLeft[i] = lastLeft[i] = $(goalsId[i]).position().left;
		goalsStartTop[i]  = lastTop[i] = $(goalsId[i]).position().top;
	}		
};

setXY();

// It is start animation
requestAnimationFrame(moveGoal);		

function moveGoal(){
	if(startGame){
		flyGoal();
	} else {
		showMenu();
	}

	var i = 0;
	if(i++ < 300) requestAnimationFrame(moveGoal);
};

function flyGoal(){
	if (!pause) {
		for (var i = 0; i < goalsId.length; i++) {
			var obj = $(goalsId[i]);

			moveWins();
			generateCoordinates(i, obj);
			checkCoordinate(i, obj);
		}
	}	
};


var	slideWins = [0, 1, 2, 2, 0];

var	IMG_WINGS_UP = "img/duck_w_up.png";
var	IMG_WINGS_GORISONT = "img/duck_w_gorisont.png"; 
var	IMG_WINGS_DOWN = "img/duck_w_down.png";
var	IMG_FALLS = "img/goalDown.png"; 

// Counts the number of circles requestAnimationFrame
var stepByWins = 0;

function moveWins(){
	if (stepByWins >= 60){
		for (var i = 0; i < goalsId.length; i++) {
			if(arrFly[i]){
				$(goalsId[i]).attr("src", getSRC(slideWins[i]));
				updateIndexWins(i);
			}
			stepByWins = 0;
		}
	}
	stepByWins++;
}

function getSRC(num) {
	switch(num) {
		case 0: return IMG_WINGS_UP;
		case 1: return IMG_WINGS_GORISONT;
		case 2: return IMG_WINGS_DOWN;
	}
}

function updateIndexWins(i){ slideWins[i] = (slideWins[i] >=2) ? 0 : slideWins[i] + 1;}

var SPEED_FALLS = 2;
var	arrSpeed = [2, 1, 2, 1, 3];

// The direction of movement
var flyRight = [false, false, true, true, true];

// true - fly, false - falls
var	arrFly = [true, true, true, true, true];
var pause  = false;
function generateCoordinates(i, obj){
	if (!pause) {
		if(arrFly[i]){
			lastLeft[i] += (flyRight[i]) ? arrSpeed[i] : -arrSpeed[i];
		} else {
			// генеруються координати для тих хто падає
			lastTop[i] += SPEED_FALLS;
			obj.attr({src: IMG_FALLS});
		}

		obj.css({'left': lastLeft[i] + 'px', 'top': lastTop[i] + 'px'}); 
	}
}

var MIN_TOP = -100;
var MAX_TOP = 1200;
var MIN_LEFT = -600;
var MAX_LEFT = 1700;

var otherStartTop = [true, false, true, false, false];

function checkCoordinate(i, obj){
	var x = lastLeft[i], y = lastTop[i];

	if (y >= MAX_TOP || y <= MIN_TOP || x <= MIN_LEFT  || x >= MAX_LEFT || lastTop[i] - goalsStartTop[i] > 180) {

		lastTop[i] = (otherStartTop[i]) ? goalsStartTop[i] * 3 : goalsStartTop[i];
		otherStartTop[i] = (otherStartTop[i]) ? false : true;

		lastLeft[i] = goalsStartLeft[i];
		arrFly[i] = true;
		obj.src = IMG_WINGS_UP;
	}
}




var countHits = 0;

$('#goal1').click(function() {_shot(0)});
$('#goal2').click(function() {_shot(1)});
$('#goal3').click(function() {_shot(2)});
$('#goal4').click(function() {_shot(3)});
$('#goal5').click(function() {_shot(4)});

function _shot(i) {
	if (startGame){
		if (resolutionShot){
			$('#countHits').text(++countHits);
			arrFly[i] = false;
		}
	}
}



function effects(){
	audioEffect((resolutionShot)? sound_gun : ricochet); 
}


var sound_gun = 'mp3/sound_gun.mp3';
var reload = 'mp3/reload.mp3';
var ricochet = 'mp3/ricochet.mp3';


function audioEffect(sound) {
	if(soundBool){
		var audioHant = new Audio(sound);
		audioHant.play();
	}
}

// Recharge cartridges after press space
$(window).keypress(function (e) {
	if (e.keyCode === 0 || e.keyCode === 32) {
		e.preventDefault();
		replaceCartridge();		
	}
});

function replaceCartridge() {
	$("#cartridges img").each(function(index){
		$(this).show();
	})
	audioEffect(reload);
	count_cartridges = 0;
	resolutionShot = true;
	displayTip('none');
}

function displayTip(disp){
	$('#tip').css('display', disp);
}

setInterval(function(){ 
	if(startGame) myTimer();

}, 1000);

var startGame = false;
var restarBool = false;

var defaultTime = 110;
var usTimer = defaultTime;
var minutes = 0;
var seconds = 0;

function myTimer() {
	if(usTimer == 0) {
		startGame = false;
		printTime(); 
		return;
	}
	printTime();

	if (!pause) usTimer--;

	if (usTimer <= 10)  $('#time').css('color', 'red');
	$('#time').text(minutes  + ":" + seconds);
}

function formatTime(time){
	minutes = Math.floor(time / 60);
	seconds = time - 60 * minutes;
	seconds = (seconds<10) ? "0" + seconds : seconds;
	minutes = (minutes<10) ? "0" + minutes : minutes;
	return minutes  + ":" + seconds;

}

// Print time in window game
function printTime() {
	$('#time').text(formatTime(usTimer));
}

function commonStartFunc(i) {
	$("#popapStart").css('display','none');
	$("#popapRestart").css('display','none');

	// audioEffect(sound_gun);
	startGame = true;
	restarBool = false;
	replaceCartridge();
	$('#time').css('color', '#fff');
}

function showMenu() {
	$('#dataTime').text(formatTime(defaultTime));
	$('#dataCount').text(countHits);
	$('#popapStart').css('display','block');
}

var $sound = $('#sound');
var $mute = $('#mute');
var soundBool = true;

$sound.click(function() {switchSound('none','block', false)});
$mute.click(function() {switchSound('block','none', true)});


function switchSound(d1, d2, bool) {
	$sound.css('display', d1);
	$mute.css('display', d2);
	soundBool = bool;
};

var bg1 = 'img/bg1.jpg';
var bg2 = 'img/bg2.jpg';
var bg3 = 'img/bg3.jpg';

var falls1 = "img/goalDown.png"
var falls2 = "img/goalDownBlue.png"
var falls3 = "img/goalDownRed.png"

$('.levels li').click(function() {
	var index = $('.levels li').index(this);
	var $bg = $('#bg1');
	var src = ''
	if(index == 0) { 
		src = bg1;
		IMG_FALLS = falls1;
	}
	if(index == 1) { 
		src = bg2;
		IMG_FALLS = falls2;
	}
	if(index == 2) { 
		src = bg3;
		IMG_FALLS = falls3;
	}
	$bg.attr('src',src);
	commonStartFunc(0);
})

$('#playGame').click(function() {
	$(this).css('display', 'none');
	$('#pauseGame').css('display', 'block');
	pause = false;
});

$('#pauseGame').click(function() {
	$(this).css('display', 'none');
	$('#playGame').css('display', 'block');
	pause = true;
});


var count_cartridges = 0;
var resolutionShot = true;

$('body').click(function() { 
	if (startGame){
		effects();
		var cartridges = $($("#cartridges img")[count_cartridges]).hide();
		++count_cartridges;

		if (count_cartridges >= 7){
			resolutionShot = false;
			displayTip('block');
		}
	}
	$('.page').css('cursor','url(../img/aim.gif) 23 22, url(../img/aim.cur) 23 22');
})