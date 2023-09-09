// 05-MAY-23
// RUDIMENTARY RECOGNIZER 1 TO 3 LIVE POINTS
// 09-JUN-23
// "SWIPE" MUST EXCLUDE 1-FINGER MOVE (WHICH IS TO BE "WRITING")


																		// ###TBD### RECOGNIZER

// INCOMING DATA FOR EVERY MOVE FOR ALL LIVE TOUCHES (1 TO 3)
// SKIP SOME MOVES FOR GREATER DISTANCE 
// BETWEEN PREVIOUS AND CURRENT POSITIONS
// (DO NOT DELTA BETWEEN IMMEDIATE NEIGHBORS)

let ref = 0;
let refpoints = { 
	0: {x: undefined, y: undefined }, 
	1: {x: undefined, y: undefined },
	2: {x: undefined, y: undefined }
}; 

// COLLECT (UP TO) THREE TOUCHPOINTS
// FIRST CURRMOVE IS SET BY "START" AS DELTA-ORIGIN
let currmove = { 
	0: {x: undefined, y: undefined },
	1: {x: undefined, y: undefined },
	2: {x: undefined, y: undefined }
};


// GESTURES
const DT = 10; // THRESHOLD FOR SIGNIFICANT DELTA
var maxd = [0, 0, 0, 0, 0, 0]; // LARGEST COORD-CHANGE 																	// ##TBD## GLOBAL SCOPE

// DISPLAY (DELTA) DATA ONLY FOR EVERY NTH MOVE
const SKIP = 10;
let counter = 0;







// —————————————————————————————————————————————————————————————————————————————————————————————
function processMove(currmove) {

// EVERY NTH MOVE SAVE A REFERENCE POINT
	if (ref === 5) {
		let temp = JSON.stringify(currmove);																							// CREATING DEEP (UNMUTATING) COPY OF OBJ
		refpoints = JSON.parse(temp);
		ref = 0;
	}
	ref++;

										// EVERY MOVE COMPARE LIVE POINT WITH EARLIER REFERENCE
	let delta0 = { x: (currmove[0].x - refpoints[0].x), y: (currmove[0].y - refpoints[0].y) };
	let delta1 = { x: (currmove[1].x - refpoints[1].x), y: (currmove[1].y - refpoints[1].y) };
	let delta2 = { x: (currmove[2].x - refpoints[2].x), y: (currmove[2].y - refpoints[2].y) };

	let deltas = [delta0.x, delta0.y, delta1.x, delta1.y, delta2.x, delta2.y];					// JUST STRING UP VALUE ON ONE LINE
	//console.log(deltas);

																			// MAX POOL OVER MOVES
	for (i = 0; i < deltas.length; i++) {
// 		if (deltas[i]) {
// 			console.log(Math.abs(deltas[i]), Math.abs(maxd[i]));
// 		}
		if ( Math.abs(deltas[i]) > Math.abs(maxd[i]) ) {
			maxd[i] = deltas[i];
		}
	} // FOR


	if (counter > SKIP) {
		//console.log(maxd);
														// ###TBD### DISPLAY IDENTIFICATION 
														// ONLY #AFTER# TOUCH HAS ENDED
														// ADD FLAG "ENDED"(?)
		logGestureId(recognizeGesture(maxd));
		counter = 0;
	}
	counter++;

} // PROCESS







// =============================================================================================
function recognizeGesture(maxd) {

// ##TBD## MOVE ERROR TO A "SAFE" ELSE CONDITION
	//let gesture_string = "SORRY NOT RECOGNIZED";
	let gesture_string = "";

// ##TBD## INTERPRET SINGLE SWIPE AS "PANNING L/R/U/D" (AND DIAGONALS)
// WHILE TOUCH IS STILL #ONGOING#


// (ADDED 09-JUN-23) "IF NUM TOUCHPOINTS LARGER 1"
// SINGLE TOUCH SWIPE (DIS-ABLE FOR WRITING)

if (numtouches > 1) {

// —————————————————————————————————————————————————————————————————————————————————————————————
//				x0       			   x1              x2
	if (maxd[0] > DT || maxd[2] > DT || maxd[4] > DT) {
		gesture_string = "SWIPE_RIGHT";
	}
	if (maxd[0] < -DT || maxd[2] < -DT || maxd[4] < -DT) {
		gesture_string = "SWIPE_LEFT";
	}

//				y0                y1               y2
	if (maxd[1] < -DT || maxd[3] < -DT || maxd[5] < -DT) {
		gesture_string = "SWIPE_UP";
	}
	if (maxd[1] > DT || maxd[3] > DT || maxd[5] > DT) {
		gesture_string = "SWIPE_DOWN";
	}

} // NUM_TOUCHES




													// ##TBD## 
													// ONE OF THE POINTS ("CENTER OF ROTATION")
													// MAY BE MORE OR LESS STATIONARY
													// HALF DT FOR THAT TOUCHPOINT (?)
													// (ERGONOMICS) DOES (FIRST/SECOND) L/R T/B DETERMINE
													// WHICH WILL BE THE "CENTER"(?)
													// ##TBD##
													// TEST RESET OF (RELATIVE) STARTPOINT AT TOUCHEND

// 2-FINGER ROTATION
// —————————————————————————————————————————————————————————————————————————————————————————————
 // HAS TWO TOUCHES TP0 AND TP1
	if (maxd[0] && maxd[1]) {

// TOUCH0 IS (RANDOMLY) AT BOTTOM OR TOP // DIRECTION INVARIANT
	//				x0       		     y0                x1             y1
		if (maxd[0] < -DT && maxd[1] < -DT && maxd[2] > DT && maxd[3] > DT) {
			gesture_string = "ROTATE_CLOCKWISE";
		}

// TOUCH0 IS (RANDOMLY) AT LEFT OR RIGHT // DIRECTION INVARIANT
	//				x0       		     y0                x1             y1
		if (maxd[0] > DT && maxd[1] > DT && maxd[2] < -DT && maxd[3] < -DT) {
			gesture_string = "ROTATE_COUNTERCLOCKWISE";
		}
	} // TWO POINTS


	return gesture_string;


} // RECOGNIZE








// 2-FINGER ROTATION
// (#TBD# SKETCHY // ADJUST FOR DEVICE ORIENTATION?)

// ROTATE_CLOCKWISE
// 0=BOTTOM POINT
//		0			 X<T-			Y<T-	(UP LEFT)
//    1			 X>T			Y>T   (DOWN RIGHT)


// ROTATE_COUNTERCLOCKWISE
// IF 0=LEFT POINT
//    0			 X>T			Y>T   (DOWN RIGHT)
//		1			 X<T-			Y<T-	(UP LEFT)



// 2-FINGER ZOOM/PINCH

// DX = X0-X1
// DY = Y0-Y1
// VECTOR XY = SQRT(DX*DX+DY*DY)

// ZOOM (ZOOM_UP)
// IF V1-V2 > T-
// PINCH (ZOOM_DOWN)
// IF V1-V2 > T



// DIAGONAL
// SWIPE_DOWN_RIGHT
//		0			 X>T			Y>T
//    1			 X>T			Y>T
//    2			 X>T			Y>T
// SWIPE_UP_RIGHT
//		0			 X>T			Y<T-
//    1			 X>T			Y<T-
//    2			 X>T			Y<T-
// SWIPE_DOWN_LEFT
//		0			 X<T-			Y>T
//    1			 X<T-			Y>T
//    2			 X<T-			Y>T
// SWIPE_UP_LEFT
//		0			 X<T-			Y<T-
//    1			 X<T-			Y<T-
//    2			 X<T-			Y<T-









// TRIGGER INTERPRETATION OF DELTA (GESTURE RECOGNITION)
// "THRESHOLD" WOULD BE ABOUT ±10(15)PX


// 1,2,3-FINGER SWIPE

// HORIZONTAL
// (LTR) SWIPE_RIGHT
//		0				X>T			 Y
//    1				X>T			 Y
//    2				X>T			 Y
// (RTL) SWIPE_LEFT
//		0			 	X<T-		 Y
//    1				X<T-		 Y
//    2			 	X<T-		 Y

// VERTICAL
// (TTB) SWIPE_UP
//		0			  X				Y<T-
//    1			  X				Y<T-
//    2			  X				Y<T-
//  (TTB) SWIPE_DOWN
//		0			  X				Y>T
//    1			  X				Y>T
//    2			  X				Y>T


