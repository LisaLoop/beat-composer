import React from 'react';
import {playAudioFromDrumPad, playAudioFromKeyboard, DrumPad, RecordButton, playAudio} from './drum-machine'
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
  var timeout = null; 

  const getIsRecording = () => {
    return isRecording
  }

  const getEvents = () => {
    return events;
  }
  const play = (events) => {
    console.log("PLAY FUNCTION RAN");
    if(events.length === 0){
      timeout = setTimeout(() => play(events),2000);
      return;
    }
    console.log("events: ", events);
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
      // let timeInFuture = event.time - start;
      let timeInFuture = event.quantizedEvent;
      console.log("timeInFuture: ", timeInFuture);
      // truncate after 2 seconds
      // if(timeInFuture > (2000 + songStartDelay)) { // not perfect, but it will give user more time to record
      //   return;
      // }
      // TODO: clear timeout to pause the song
      setTimeout(() => {
        console.log(event);
        // TODO: Download the sounds so that it doesn't break when the url changes
        playAudio(event.data.url)
      },timeInFuture);
    })

   timeout = setTimeout(() => play(events),2000)
  }
  
  const addEvent = (data) => {
    events.push({time: Date.now(), data: data})
    // console.log("events: ", events);
    // console.log("pitch: ", pitch);
    setEvents(events)
  }

  const stop = () => {
    // stop the party
    clearTimeout(timeout);


  }

  const toggleRecording = () => {
    console.log("RECORD FUNCTION RAN");
      if(isRecording){
          setIsRecording(false)
          stop()
          console.log("events: ", events);
      } else {
          play(getEvents())
          setIsRecording(true)
          setEvents([]);
          // TODO: as soon as user hits first note, start the 2 second delay
          setStart(Date.now())
      }
  }
  return (
    <>
      <h1 style={{textAlign:"center"}}>Beats Composer</h1>
      <main onKeyPress={e => { console.log(e.key); playAudioFromKeyboard(drumData, e.key); }}>
        <div style={{textAlign:"center"}}>
          <div className="pad">
          {drumData
            .map(data => <DrumPad getIsRecording={getIsRecording}
                                  addEventHandler={addEvent} 
                                  key={data.id} data={data} 
                                  label={`${data.id} - ${data.keyTrigger}`}
                                  onHit={playAudioFromDrumPad} />)}
          </div>
          <div className="action-list">
            <RecordButton onPlay={() => play(getEvents())}
                          getIsRecording={getIsRecording}
                          onRecord={toggleRecording}/>
            <RecordingBar/>
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
