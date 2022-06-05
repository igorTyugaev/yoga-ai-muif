import GestureDescription from "fingerpose/src/GestureDescription";
import {Finger, FingerCurl, FingerDirection} from "fingerpose/src/FingerDescription";

// describe ok gesture 👌
const okGesture = new GestureDescription('ok')

// thumb:
okGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
okGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, .75);

// index:
okGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
okGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, .75);

// Middle:
okGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
okGesture.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, .75);
// okGesture.addDirection(Finger.Middle, FingerDirection.VerticalUp, .25);

// Ring:
okGesture.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
okGesture.addDirection(Finger.Ring, FingerDirection.VerticalUp, .75);
// okGesture.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, .25);


// Pinky:
okGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
okGesture.addDirection(Finger.Pinky, FingerDirection.VerticalUp, .75);


export default okGesture;