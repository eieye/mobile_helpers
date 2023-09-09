let datestring = `FRI 05-MAY-23 1217`;
let msgstring= "DATA FOR UP TO EIGHT TOUCHES"
const MSG = document.getElementById('message');

console.log(datestring);
displayMsg(datestring + "<br>" + msgstring);








																					// LIVE DISPLAY
// ==============================================================================================
																			// INIT DISPLAY STATES
const NUMCOL = 4; 																																		// 4 EVENT TYPES // MAP GRID TO THESE NUMBERS
const NUMROW = 8;							  																											// 8 TOUCH ID
let num = 0;
let skipnum = 10;							  																											// SKIP DISPLAY OF NTH "MOVE" EVENTS 

let STARTED = [];
let MOVING = [];
let ENDED = [];
let CANCELLED = [];
let STATES = [STARTED, MOVING, ENDED, CANCELLED];

for (let col = 0; col < NUMCOL; col++) {
	for (let row = 0; row < NUMROW; row++) {
		STATES[col][row] = false;
	}
}





// —————————————————————————————————————————————————————————————————————————————————————————————
																	// UPDATE DISPLAY/GRID STATES
function updateStates(state, t) {

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
	for (let col = 0; col < STATES.length; col++) { 																		// (4) EVENT TYPES
		for (let row = 0; row < STATES[col].length; row++) {  														// (8) TOUCH ID
			GRID[col][row].style.visibility = STATES[col][row] ? "visible" : "hidden";
		}
	}

} // UPDATE




// —————————————————————————————————————————————————————————————————————————————————————————————
																		// GRID DISPLAY TOUCHSTATES
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

																// ENABLE FOR UP TO EIGHT TOUCHES
const start3 = document.getElementById('start3');
const move3 = document.getElementById('move3');
const end3 = document.getElementById('end3');
const cancel3 = document.getElementById('cancel3');

const start4 = document.getElementById('start4');
const move4 = document.getElementById('move4');
const end4 = document.getElementById('end4');
const cancel4 = document.getElementById('cancel4');

const start5 = document.getElementById('start5');
const move5 = document.getElementById('move5');
const end5 = document.getElementById('end5');
const cancel5 = document.getElementById('cancel5');

const start6 = document.getElementById('start6');
const move6 = document.getElementById('move6');
const end6 = document.getElementById('end6');
const cancel6 = document.getElementById('cancel6');

const start7 = document.getElementById('start7');
const move7 = document.getElementById('move7');
const end7 = document.getElementById('end7');
const cancel7 = document.getElementById('cancel7');


																	// MAP GRID-CELLS TO BUFFER
																			// COLUMNS * ROWS
const GRID = [ [start0, start1, start2, start3, start4, start5, start6, start7], 
							 [move0, move1, move2, move3, move4, move5, move6, move7],
							 [end0, end1, end2, end3, end4, end5, end6, end7], 
							 [cancel0, cancel1, cancel2, cancel3, cancel4, cancel5, cancel6, cancel7] ];


																		// INIT DISPLAY/GRID
for (let col = 0; col < STATES.length; col++) { 																			// (4) EVENT TYPES
	for (let row = 0; row < STATES[col].length; row++) {  															// (8) TOUCH ID
		GRID[col][row].style.visibility = STATES[col][row] ? "visible" : "hidden";
	}
}







// —————————————————————————————————————————————————————————————————————————————————————————————
																		// TOUCHPOINT COORDINATES
																							// DOM
const pos0 = document.getElementById('pos0'); 																				// CELL IN GRID
const pos1 = document.getElementById('pos1');
const pos2 = document.getElementById('pos2');
																		// TOUCHES FOUR TO EIGHT
const pos3 = document.getElementById('pos3');
const pos4 = document.getElementById('pos4');
const pos5 = document.getElementById('pos5');
const pos6 = document.getElementById('pos6');
const pos7 = document.getElementById('pos7');

const COORDS = [pos0, pos1, pos2, pos3, pos4, pos5, pos6, pos7];

// INIT
COORDS.forEach(cell => {
	cell.innerHTML = "";
});

																									
// ZTE A7020 SCREEN 720*1560
// AT PIXEL-RATIO = 2.25
// DEVICE DISPLAYS DEVICE-PIXELS
// 320*693 // Y GIVEN AS APPROX. -85 TO 608 (FROM UNDER BROWSER TOP NAVIGATION HEADER)
// (= CLIENTXY / RATIO)

																			// WRITE POSITIONS
function displayCoordinates(tp, x, y) {
	if (x === null && y === null) {
		COORDS[tp].innerHTML = ""; 																											// BLANK WHEN MOVE HAS ENDED
	} else {
		COORDS[tp].innerHTML = `${parseInt(x)} ${parseInt(y)}`;
	}
}










																		// TOUCHPOINT (TP) "RIPPLE"
// ==============================================================================================

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

	for (let t = 0; t < e.changedTouches.length; t++) {																	// (CHANGED IS WHAT IS NEW)		
		let tpid = e.changedTouches[t].identifier;

		const span = document.createElement('span'); 																			// (CONST) UNIQUE AND SHORT LIVED
		let x = e.changedTouches[t].clientX;
		let y = e.changedTouches[t].clientY;

		span.classList.add('TPcircle');
		span.setAttribute('id', `TP${tpid}`);
		touchpointhook.appendChild(span);
		span.style.left = `${x}px`;
		span.style.top = `${y}px`;

		if (tpid < NUMROW) {
			updateStates("START", tpid);
			displayCoordinates(tpid, x, y);
		} else {
			// NO UPDATE DATA-DISPLAY (ALL TOUCHPOINTS ARE SHOWN)
		}
	}

	showNumTouches(e.touches.length);

} // TOUCHSTART








// —————————————————————————————————————————————————————————————————————————————————————————————
																			// HANDLER TOUCHMOVE

function moveTP(e) {
	e.preventDefault();

	for (let t = 0; t < e.changedTouches.length; t++) {																	// (CHANGED IS WHAT HAS MOVED)
		let tpid = e.changedTouches[t].identifier;																				// (!)IDENTIFIER #NOT# INDEX
		movespan = document.getElementById(`TP${tpid}`);
		let x = e.changedTouches[t].clientX;
		let y = e.changedTouches[t].clientY;
		movespan.style.left = `${x}px`;
		movespan.style.top = `${y}px`;
																// DISPLAY ONLY EVERY NTH MOVE
		if (num > skipnum) {
			if (tpid < NUMROW) {																														// (LIMIT TO 8)
				updateStates("MOVE", tpid);
				displayCoordinates(tpid, x, y);
			} else {
				// NO UPDATE DATA-DISPLAY (ALL TOUCHPOINTS ARE SHOWN)
			}
			// RESET COUNTER
			num = 0;
		}
		num++;
	} // FOR

} // TOUCHMOVE









// —————————————————————————————————————————————————————————————————————————————————————————————
																			// HANDLER TOUCHEND


function endTP(e) {

	for (let t = 0; t < e.changedTouches.length; t++) {
		let killid = e.changedTouches[t].identifier;																			// (CHANGED IS WHAT HAS ENDED)
		killspan = document.getElementById(`TP${killid}`);
		killspan.remove();
			// (COORD UPDATE SAME AS LAST MOVED)
		let x = e.changedTouches[t].clientX; 																							// ARG TO "PARSE_INT" // EXPECTS NUM
		let y = e.changedTouches[t].clientY;

		if (killid < NUMROW) {
			updateStates("END", killid);
			displayCoordinates(killid, null, null); // BLANK
		} else {
			// NO UPDATE DATA-DISPLAY (ALL TOUCHPOINTS ARE SHOWN)
		}
	}

	showNumTouches(e.touches.length);

// RE-SET BULLETS 																																		// #TEMP# (BOTH COULD RECYCLE SOME COMMON INIT-FUNCTION)
	if (e.touches.length === 0) {
																// SHOW BULLET "END" FOR A BRIEF MOMENT
		setTimeout( () => {
																				// (RE)INIT STATES
			for (let col = 0; col < NUMCOL; col++) {
				for (let row = 0; row < NUMROW; row++) {
					STATES[col][row] = false;
				}
			}
																		// (RE)INIT DISPLAY/GRID
			for (let col = 0; col < NUMCOL; col++) {
				for (let row = 0; row < NUMROW; row++) {
					GRID[col][row].style.visibility = STATES[col][row] ? "visible" : "hidden";
				}
			}
		}, 500);
	} // RE-SET

// ##TBD## DEBUGGING																																	// UPDATE BULLET FOR "START" IMMEDIATELY WITH NEXT MOVE
	skipnum = 10;																																				// (STILL BULLET LINGERS OR DISAPPERS // MAYBE CLICK PRECISION)

} // TOUCHEND








// —————————————————————————————————————————————————————————————————————————————————————————————
																		// HANDLER TOUCHCANCEL

// ON ZTE A7S 2020 DIS-ABLE (ANDOID MI_FAVOR UI EXTENSION)
// "THREE-FINGER PINCH FOR A SCREENSHOT"
// (FEATURE IS TOO OPAQUE TO DEAL WITH HERE)
// https://www.xda-developers.com/zte-unveils-mifavor-10-skin-based-android-10/?newsletter_popup=1


function cancelTP(e) {

	for (let t = 0; t < e.changedTouches.length; t++) {
		let killid = e.changedTouches[t].identifier;																			// (CHANGED IS WHAT WAS CANCELLED)
		killspan = document.getElementById(`TP${killid}`);
		killspan.remove();
			// (COORD UPDATE SAME AS LAST MOVED)
		let x = e.changedTouches[t].clientX;
		let y = e.changedTouches[t].clientY;
			if (killid < NUMROW) {
				updateStates("CANCEL", killid);
				displayCoordinates(killid, x, y);
			} else {
				// NO UPDATE DATA-DISPLAY (ALL TOUCHPOINTS ARE SHOWN)
			}
	}
	showNumTouches(e.touches.length);
	totallasttp = e.touches.length;
							// ##UNCLEAR## HOW CANCEL WORKS ON STANDARD ANDROID OR IOS
																// CONTINGENT RESET
	let tsibling = document.getElementById('wrapper');
	let killedtps = 0;
	while (tsibling.nextElementSibling) {
		tsibling.nextElementSibling.remove();
		killedtps++;
	}
	console.log("REMOVED", killedtps);

} // TOUCHCANCEL







																		// ##TBD## INTERPRET GESTURE
																		// TWO-FINGER-SWIPE/PINCH/ZOOM
// ===========================================================================================
																				// ##TEMP## INIT
function showNumTouches(num) {
	let numstring = `<br>TOUCHES ${num}`;
	let msg = datestring + numstring;
	datestring + numstring;
	displayMsg(msg);
}

function displayMsg(msg) {
	MSG.innerHTML = `${msg}`;
}

// RECOGNIZER CONTINUED IN FILE "MULTI-TOUCH RECOGNIZE 2-FINGER SWIPE

