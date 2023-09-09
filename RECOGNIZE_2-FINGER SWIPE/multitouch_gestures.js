let datestring = `FRI 09-JUN-23 1026`;
let msgstring= "DATA UPDATED FOR UP TO THREE TOUCHES<br>BUT ALL TOUCHPOINTS ARE SHOWN<br>RECOGNIZER ONLY FOR TWO-FINGER SWIPE"
const DATE = document.getElementById('datelog');
const GESTURE = document.getElementById('gesturelog');


																				// LOG TO SCREEN
function logGestureId(txt) {
	GESTURE.innerHTML = `${txt}`;
}

function logDate(msg) {
	DATE.innerHTML = `${msg}`;
}

console.log(datestring);
logDate(datestring);
logGestureId(msgstring);

// (09-JUN-23) // EXCLUDE 1-FINGER "SWIPE"
let numtouches = 0;





																				// DATA STATES
// ==============================================================================================

let STARTED = [false, false, false]; // STATE // TOUCH 0,1,2
let MOVING = [false, false, false];
let ENDED = [false, false, false];
let CANCELLED = [false, false, false];
let STATES = [STARTED, MOVING, ENDED, CANCELLED];


																	// UPDATE DISPLAY/GRID STATES
function updateStates(state, t) { 																												// LIMITED TO DATA FOR "T"=THREE TOUCHES

if (state === "START") {
	STARTED[t] = true;
	MOVING[t] = false;
	ENDED[t] = false;
	CANCELLED[t] = false;
}
if (state === "MOVE") {
	STARTED[t] = false;
	MOVING[t] = true;
	ENDED[t] = false;
	CANCELLED[t] = false;
}
if (state === "END") {
	STARTED[t] = false;
	MOVING[t] = false;
	ENDED[t] = true;
	CANCELLED[t] = false;
}
if (state === "CANCEL") {
	STARTED[t] = false;
	MOVING[t] = false;
	ENDED[t] = false;
	CANCELLED[t] = true;
}

// COLUMNS * ROWS
STATES = [STARTED, MOVING, ENDED, CANCELLED];

																					// UPDATE BULLETS
	for (let col = 0; col < STATES.length; col++) { 																				// EVENT TYPES
		for (let row = 0; row < STATES[col].length; row++) {  																// TOUCH ID
			GRID[col][row].style.visibility = STATES[col][row] ? "visible" : "hidden";
		}
	}

} // UPDATE





																			// DISPLAY STATES
// ==============================================================================================

																					// DOM BULLETS
const start0 = document.getElementById('start0');
const move0 = document.getElementById('move0');
const end0 = document.getElementById('end0');
const cancel0 = document.getElementById('cancel0');

const start1 = document.getElementById('start1');
const move1 = document.getElementById('move1');
const end1 = document.getElementById('end1');
const cancel1 = document.getElementById('cancel1');

const start2 = document.getElementById('start2');
const move2 = document.getElementById('move2');
const end2 = document.getElementById('end2');
const cancel2 = document.getElementById('cancel2');


																			// MAP GRID-CELLS TO BUFFER
																					// COLUMNS * ROWS
const GRID = [ [start0, start1, start2], [move0, move1, move2], [end0, end1, end2], [cancel0, cancel1, cancel2] ];


																				// INIT DISPLAY/GRID
for (let s = 0; s < STATES.length; s++) {
	for (let t = 0; t < STATES[s].length; t++) {
		GRID[s][t].style.visibility = STATES[s][t] ? "visible" : "hidden";
	}
}





																		// TOUCHPOINT COORDINATES
// ==============================================================================================

																			// DOM POSITIONS
const pos0 = document.getElementById('pos0'); // CELL IN GRID (LIMIT DAT TO THREE TOUCHES)
const pos1 = document.getElementById('pos1');
const pos2 = document.getElementById('pos2');
const COORDS = [pos0, pos1, pos2];

// INIT
COORDS.forEach(cell => {
	cell.innerHTML = "";
});

																									
// ZTE A7020 SCREEN 720*1560
// AT PIXEL-RATIO = 2.25
// DEVICE DISPLAYS DEVICE-PIXELS
// 320*693 // Y GIVEN AS APPROX. -85 TO 608 (FROM UNDER BROWSER TOPNAV)
// (= CLIENTXY / RATIO)

																			// WRITE POSITIONS
function displayCoordinates(tp, x, y) {
	COORDS[tp].innerHTML = `${parseInt(x)} ${parseInt(y)}`;
}







																// TOUCHPOINT MARKER ("RIPPLE")
// ==============================================================================================
// ALL LIVE TOUCHPOINTS ARE SHOWN
// (ZTE HARDWARE UP TO 9 TP)

const touchpointhook = document.getElementById('touchpointhook');

window.addEventListener('touchstart', startTP, {passive: false} );
window.addEventListener('touchmove', moveTP, {passive: false} );
window.addEventListener('touchend', endTP);
window.addEventListener('touchcancel', cancelTP);

let killspan;
let movespan;












// —————————————————————————————————————————————————————————————————————————————————————————————
																			// HANDLER TOUCHSTART

function startTP(e) {																																	// (STILL GETTING SCROLLBARS AT LOWER RIGHT CORNER)
	e.preventDefault();
	numtouches = e.touches.length;

	for (let t = 0; t < e.changedTouches.length; t++) {																	// (CHANGED IS WHAT IS NEW)		
		let tpid = e.changedTouches[t].identifier;

		const span = document.createElement('span'); 																			// (CONST) UNIQUE AND SHORT LIVED
		let x = e.changedTouches[t].clientX;
		let y = e.changedTouches[t].clientY;

		span.classList.add('TPcircle');
		span.setAttribute('id', `TP${tpid}`);
		touchpointhook.appendChild(span);
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// (LATER EXTENSION)
		// OPEN POLYLINE AND TRACE TOUCHMOVE
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		span.style.left = `${x}px`;
		span.style.top = `${y}px`;

														// LIMIT DATA-DISPLAY TO THREE TOUCHES
		if (tpid < 3) {
			updateStates("START", tpid);
			displayCoordinates(tpid, x, y);
																// INIT FIRST TRIPLE FOR MOVE-DELTA
			currmove[tpid].x = parseInt(x);
			currmove[tpid].y = parseInt(y);

		} else {
			// NO UPDATE DATA-DISPLAY
			// (ALL TOUCHPOINTS ARE SHOWN)
		}
	}

} // START








// —————————————————————————————————————————————————————————————————————————————————————————————
																			// HANDLER TOUCHMOVE

function moveTP(e) {
	e.preventDefault();
	numtouches = e.touches.length;

	for (let t = 0; t < e.changedTouches.length; t++) {																			// (CHANGED IS WHAT HAS MOVED)
		let tpid = e.changedTouches[t].identifier;																						// (!)IDENTIFIER #NOT# INDEX

		movespan = document.getElementById(`TP${tpid}`);
		let x = e.changedTouches[t].clientX;
		let y = e.changedTouches[t].clientY;
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// (LATER EXTENSION)
		// ADD POINTS TO POLYLINE
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		movespan.style.left = `${x}px`;
		movespan.style.top = `${y}px`;


																	// DISPLAY DATA FOR EVERY MOVE
																// (BUT LIMIT TO THREE TOUCHES)
		if (tpid < 3) {
			updateStates("MOVE", tpid);
			displayCoordinates(tpid, x, y);		 																									// (PARSE_INT ARG)

									// CALL WITH ANY NUMBER OF TOUCHES (BUT LESS THAN FOUR)
									// ADD POINTS FOR ONE CYCLE (TP0-TP1 OR TP0-TP2-TP1)
									// "SPREAD" (SKIP) THE POINTS FOR DELTA IN RECOGNIZER
// COLLECT LIVE TOUCHES
			if (tpid === 0) {
				currmove[0] = { x: parseInt(x), y: parseInt(y) };
			} else if (tpid === 1) {
				currmove[1] = { x: parseInt(x), y: parseInt(y) };
			} else if (tpid === 2) {
				currmove[2] = { x: parseInt(x), y: parseInt(y) };
			}
// AFTER LAST ENTRY SEND COLLECTED
			if (tpid === e.changedTouches.length - 1) {
				processMove(currmove); // , prevmove
				//let temp = JSON.stringify(currmove);																							// CREATING DEEP (UNMUTATING) COPY OF OBJ
				//prevmove = JSON.parse(temp);
				//console.log(currmove); // 1 TO 3 POINTS
			}


		}
	} // FOR

} // MOVE








// —————————————————————————————————————————————————————————————————————————————————————————————
																			// HANDLER TOUCHEND

function endTP(e) {
	numtouches = e.touches.length;

	for (let t = 0; t < e.changedTouches.length; t++) {
		let killid = e.changedTouches[t].identifier;																						// (CHANGED IS WHAT HAS ENDED)
		killspan = document.getElementById(`TP${killid}`);
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// (LATER EXTENSION)
		// CLOSE POLYLINE // THAN REMOVE OR FADE-OUT
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		killspan.remove();
			// (COORD UPDATE SAME AS LAST MOVED)
		let x = e.changedTouches[t].clientX; 																										// TO "PARSE_INT" // EXPECTS NUM
		let y = e.changedTouches[t].clientY;

													// LIMIT DATA-DISPLAY TO THREE TOUCHES
			if (killid < 3) {
				updateStates("END", killid);
				displayCoordinates(killid, x, y);

// RESET GUARANTEES EVERY FIRST POINT IN NEW MOVE IS COMPARED TO "UNDEFINED"
// RESULTING IN "NAN" FOR FIRST DELTA ("POINT 03" MINUS "POINT 0" OF MOVE)
// ELIMINATING "FREAK" JUMPS IN COORDINATE CHANGES
				refpoints = {
					0: {x: undefined, y: undefined }, 
					1: {x: undefined, y: undefined },
					2: {x: undefined, y: undefined }
				}; 

			} else {
				// NO UPDATE
			}
	}

	// RESET RECOGNIZER
	maxd = [0, 0, 0, 0, 0, 0];

} // END









// —————————————————————————————————————————————————————————————————————————————————————————————
																		// HANDLER TOUCHCANCEL

// ON ZTE A7S 2020 DIS-ABLE (ANDOID MI_FAVOR UI EXTENSION)
// "THREE-FINGER PINCH FOR A SCREENSHOT"
// (FEATURE IS TOO OPAQUE TO DEAL WITH HERE)
// https://www.xda-developers.com/zte-unveils-mifavor-10-skin-based-android-10/?newsletter_popup=1


function cancelTP(e) {
	numtouches = e.touches.length;

	for (let t = 0; t < e.changedTouches.length; t++) {
		let killid = e.changedTouches[t].identifier;																			// (CHANGED IS WHAT WAS CANCELLED)
		killspan = document.getElementById(`TP${killid}`);
		killspan.remove();
			// (COORD UPDATE SAME AS LAST MOVED)
		let x = e.changedTouches[t].clientX;
		let y = e.changedTouches[t].clientY;
		
													// (!)LIMIT DATA-DISPLAY TO THREE TOUCHES
			if (killid < 3) {
				updateStates("CANCEL", killid);
				displayCoordinates(killid, x, y);
			} else {
				// NO UPDATE DATA-DISPLAY
				// (ALL TOUCHPOINTS ARE SHOWN)
			}
	}
	// RESET RECOGNIZER
	maxd = [0, 0, 0, 0, 0, 0];

							// ##UNCLEAR## HOW CANCEL WORKS ON STANDARD ANDROID OR IOS
																// CONTINGENT RESET
	let tsibling = document.getElementById('wrapper');
	let killedtps = 0;
	while (tsibling.nextElementSibling) {
		tsibling.nextElementSibling.remove();
		killedtps++;
	}
	console.log("REMOVED", killedtps);

} // CANCEL













