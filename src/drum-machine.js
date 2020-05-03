import React from 'react'

// 120 bpm = 2hrtz

export const playAudio = (url) => {
  let audio = document.createElement("audio");
  audio.src = url; 
  const playAudio = () => {
    audio.play();
    audio.removeEventListener("canplay", playAudio);
    audio = null;
  };
  audio.addEventListener("canplay", playAudio);
};

export const playAudioFromKeyboard = (drums, code) => {
  const letter = code.toLowerCase();
  const data = drums.find(drum => drum.keyTrigger.toLowerCase() === letter);
  if (data) playAudio(data.url);
};

export const playAudioFromDrumPad = ({ url }) => {
    playAudio(url)
};

export const DrumPad = ({ data, onHit, getIsRecording, addEventHandler}) => {
    const clickHandler = () => {
        console.log("getIsRecording:", getIsRecording());
        if(getIsRecording()){
            addEventHandler(data)        
        }
        onHit(data)
    }
    return <button className="key" onClick={clickHandler}>{data.id}</button>;
}


export const RecordButton = ({onRecord, getIsRecording}) => {
    return (
        <button 
        className={`record-button ${getIsRecording() ? 'recording-style':''}`}
        onClick={onRecord}> </button>
    )
}

export const PlayButton = ({onPlay}) => {
    return (
        <button className="play-button" onClick={onPlay}>⏯</button>
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