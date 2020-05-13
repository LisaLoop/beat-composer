import React from 'react';
import {playAudioFromDrumPad, playAudioFromKeyboard, DrumPad, RecordButton, playAudio} from './drum-machine'
import {getPastelColors, getSaturatedColors} from './colors'
import {RecordingBar} from './recording-bar'
import './App.css';

/* TODO
- Styling 
- Show recording bar
- Ability to stop/pause
- Add step sequencer to allow user to remove notes
*/

const App = ({ drumData }) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [start, setStart] = React.useState(null);
  const [events, setEvents] = React.useState([]);
  const [timeout, setGTimeout] = React.useState(null); 
  const [multiplier, setMultiplier] = React.useState(1);
  let timeoutList = [];
  // const [isPlaying, setIsPlaying] = React.useState(false)

  const getIsRecording = () => {
    return isRecording
  }

  const getEvents = () => {
    return events;
  }
  const play = () => {
    let events = getEvents();
    console.log("PLAY FUNCTION RAN");
    console.log("events in PLAY: ", events);
    if(events.length === 0){
      setGTimeout(setTimeout(() => play(),2000)) 
      return;
    }

    // bpm is 120
    // Quantizing 
    let newEvents = [];
    // let songStartDelay = start - events[0].time;
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
      
    });

    newEvents.map((event) => {
      let timeInFuture = event.quantizedEvent;
      console.log("timeInFuture: ", timeInFuture);
      // truncate after 2 seconds
      // if(timeInFuture > (2000 + songStartDelay)) { // not perfect, but it will give user more time to record
      //   return;
      // }
      // TODO: clear timeout to pause the song
      let t = setTimeout(() => {
        console.log(event);
        
        // TODO: Download the sounds so that it doesn't break when the url changes
        console.log("event.data.id: ", event.data.id);
        playAudio(event.data)
      },timeInFuture);
      timeoutList.push(t);
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

  const pastelColors = getPastelColors();
  const saturatedColors = getSaturatedColors();

  const handleKeyboardInput = (e) => {
    console.log(e.key); 
    playAudioFromKeyboard(drumData, e.key); 
    if(e.key == 1 || e.key == 2 || e.key === 3 || e.key == 4){
      setMultiplier(parseInt(e.key,10))
    }
  }

  return (
    <>
      <h1 className="title" style={{textAlign:"center"}}>Beats Composer</h1>
      <main onKeyPress={e => handleKeyboardInput(e)}>
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
