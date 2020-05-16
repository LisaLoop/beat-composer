import React from 'react';
import {playAudioFromDrumPad, playAudioFromKeyboard, DrumPad, RecordButton, playAudio} from './drum-machine'
import {getSaturatedColors} from './colors'
import {RecordingBar} from './recording-bar'
import './App.css';

/* TODO
- Show new buttons in UI 1,2,3,4
- Add step sequencer to allow user to remove notes
- Let user switch between soundbanks
- Download audio files to computer 
- Pre-load all audio into the browser memory so there is no delay on keypress. 
- Space bar should record ✅

*/

const App = ({ drumData }) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [start, setStart] = React.useState(null);
  const [events, setEvents] = React.useState([]);
  const [timeout, setGTimeout] = React.useState(null); 
  const [multiplier, setMultiplier] = React.useState(1);
  let timeoutList = [];
  

  const getIsRecording = () => {
    return isRecording
  }

  const getEvents = () => {
    return events;
  }
  const play = () => {
    let events = getEvents();
    if(events.length === 0){
      setGTimeout(setTimeout(() => play(),2000)) 
      return;
    }

    // bpm is 120
    // Quantizing 
    let newEvents = [];
    events.map((event) => {
      // allows the user time to play the first sound
      let st = events[0].time;
      let t = (event.time - st) // 
      let remainder = t % 125; // User can configure 2 seconds 
      event.quantizedEvent = t - remainder; // 2000/16 (2 seconds, 16 bit track)
      // Continue recording during playback
      // TODO:let user configure bpm 120/140...etc. 
      event.quantizedEvent = event.quantizedEvent % 2000; 
      newEvents.push(event)
      return undefined
    });

    newEvents.map((event) => {
      let timeInFuture = event.quantizedEvent;
      console.log("timeInFuture: ", timeInFuture);
      // truncate after 2 seconds
      // if(timeInFuture > (2000 + songStartDelay)) { // not perfect, but it will give user more time to record
      //   return;
      // }
      let t = setTimeout(() => {
        console.log(event);
        
        playAudio(event.data)
        return
      },timeInFuture);

      timeoutList.push(t);
      return undefined
    })

   setGTimeout(setTimeout(() => play(),2000))
  }
  
  const addEvent = (data) => {
    if(multiplier !== 1){
      let s = 2000/multiplier; // 2000/4 = 500
      for(let i=0; i<multiplier; i++){
        events.push({time: Date.now()+s*i, data: data}) 
        // 4 -> 0 1 2 3, 2 -> 0, .5
      }
      setMultiplier(1)
    } else {
      events.push({time: Date.now(), data: data})
    }
    
    // console.log("events: ", events);
    // console.log("pitch: ", pitch);
    setEvents(events)
  }

  const stop = () => {
    console.log("STOP FUNCTION RAN")
    // stop the party
    clearTimeout(timeout);
    // to = time out
    timeoutList.map((to) => clearTimeout(to))
    timeoutList = [];    
  }

  const toggleRecording = () => {
    console.log("RECORD FUNCTION RAN");
      if(isRecording){
          setIsRecording(false)
          stop()
          console.log("events: ", events);
      } else {
          play()
          setIsRecording(true)
          // setEvents([]);
          // TODO: as soon as user hits first note, start the 2 second delay
          setStart(Date.now())
      }
  }

  const saturatedColors = getSaturatedColors();

  const handleKeyboardInput = (e) => {
    console.log("e.key: ", e.key, " e.code: ", e.code);
    if(e.code === 'KeyR'){
      toggleRecording()
    }
    const data = playAudioFromKeyboard(drumData, e.key);
    if(getIsRecording()){
      if(data){
        addEvent(data)
      }
    }
    // Because music
    if(e.key === "1" || e.key === "2" || e.key === "4" || e.key === "8"){
      setMultiplier(parseInt(e.key,10))
    }
  }
  document.onkeydown = handleKeyboardInput; 
  return (
    <>
      <h1 className="title" style={{textAlign:"center"}}>Beats Composer</h1>
      <main>
        <div style={{textAlign:"center"}}>
          <div className="pad">
          {drumData
            .map((data,i) => <DrumPad 
                                  color={saturatedColors[i]}
                                  getIsRecording={getIsRecording}
                                  addEventHandler={addEvent} 
                                  key={data.id} data={data} 
                                  label={`${data.id} - ${data.keyTrigger}`}
                                  onHit={playAudioFromDrumPad} />)}
          </div>
          <div className="action-list">
            <RecordButton getIsRecording={getIsRecording}
                          onRecord={toggleRecording}/>
            <RecordingBar getIsRecording={getIsRecording}/>
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
