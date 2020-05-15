import React from 'react'
import {getPastelColors, getSaturatedColors} from './colors'
import {getIsRecording} from './App'

// 120 bpm = 2hrtz

export const playAudio = (data) => {
  let audio = document.createElement("audio");
  audio.src = data.url; 
  const innerPlayAudio = () => {
    audio.play();
    audio.removeEventListener("canplay", innerPlayAudio);
    audio = null;
  };
  audio.addEventListener("canplay", innerPlayAudio);
  const pastelColors = getPastelColors();
  const saturatedColors = getSaturatedColors();
  document.getElementById(data.id).style.backgroundColor = saturatedColors[data.color];
  setTimeout(()=> {
	document.getElementById(data.id).style.backgroundColor = pastelColors[data.color];
  },125)
};

export const playAudioFromKeyboard = (drums, code) => {
  const letter = code.toLowerCase();
  const data = drums.find(drum => drum.keyTrigger.toLowerCase() === letter);
  if (data) {
	//   console.log("~", getIsRecording());
	  playAudio(data)
	};
	return data;
};

export const playAudioFromDrumPad = (data) => {
	console.log("data:", data);
    playAudio(data);
};

export const DrumPad = ({ data, onHit, getIsRecording, addEventHandler, color}) => {
	console.log("data in drumpad: ", data);
    const clickHandler = () => {
        // console.log("getIsRecording:", getIsRecording());
        if(getIsRecording()){
            addEventHandler(data)        
        }
        onHit(data)
	}
	// label has the name of the sound and the keyboard code
	return 	<button
				id={data.id} 
				style={{backgroundColor: color}}
				className="key" 
				onMouseDown={clickHandler}>{`${data.id} - ${data.keyTrigger}`}
			</button>
		
}

const hitRecordFromKeyboard = () => {}
export const RecordButton = ({onRecord, getIsRecording}) => {
    return (
        <button 
        className={`record-button ${getIsRecording() ? 'recording-style button-glow':''}`}
        onClick={onRecord}> </button>
    )
}

export const DownloadButton = () => {
	return (
		<button>Download</button>
	)
}

/*** 
 * 	sounds = []


	sounds[0] = {"name":"drum1","file":"file.mp3"}
	sounds[1] = {"name":"drum1","file":"file.mp3"}
	sounds[2] = {"name":"drum1","file":"file.mp3"}
	sounds[3] = {"name":"drum1","file":"file.mp3"}


	//4
	modes = []
	modes[0] = [0,1,2,3];
	modes[1] = [4,5,6,7];
	modes[2] = [8,9,10,11];

	modes[3] = [0,1,6,9];

	currentsoundset = [0,1,2,3];

	isRecording = 0

	record:
		if isRecording is 0:
			st = now
			song = []
		else:
			end =  now
			beat = ( 1000 / 60 ) * 16

			time2offset():
				for all events:
					subtract start date
	
				=>
			offset2perfectoffset():
				for x in event:
					event.time = quantize(event.time) round 

			quantizedSong = out ^

	button.onClick(b):
		if isRecording:
			song.push({time:now, pitch: currentsoundset[b] })
		playSound()

	right.onclick:
		currentmode ++ ;
		if currentmode > 3
			currentmode = 0
		currentsoundset = modes[currentmode];

	right.onclick:
		currentmode -- ;
		if currentmode < 0
			currentmode = 3
		currentsoundset = modes[currentmode];

	play:
		ss = now 
		for each event in quantizedSong:
			ev.time = event.time + ss
		
		for x in :
			setTimeout("playSound(x.pitch)",x.time)

	download:
		convert to mp3 download.
*/