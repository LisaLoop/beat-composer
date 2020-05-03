import React from 'react';
import {playAudioFromDrumPad, playAudioFromKeyboard, DrumPad, RecordButton, PlayButton, playAudio} from './drum-machine'
import './App.css';

const App = ({ drumData }) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [start, setStart] = React.useState(null);
  const [events, setEvents] = React.useState([]);
  
  const getIsRecording = () => {
    return isRecording
  }

  const getEvents = () => {
    return events;
  }
  const play = (events) => {
    console.log("events: ", events);
    // bpm is 120
    // Quantizing 
    let newEvents = [];
    events.map((event) => {
      let t = (event.time - start) // 
      let remainder = t % 125; // User can configure 2 seconds 
      event.quantizedEvent = t - remainder; // 2000/16 (2 seconds, 16 bit track)
      newEvents.push(event)
      
    });

    newEvents.map((event) => {
      // let timeInFuture = event.time - start;
      let timeInFuture = event.quantizedEvent;
      console.log("timeInFuture: ", timeInFuture);
      // truncate after 2 seconds
      if(timeInFuture > 2000) {
        return;
      }
      // TODO: clear timeout to pause the song
      setTimeout(() => {
        console.log(event);
        // TODO: Download the sounds so that it doesn't break when the url changes
        playAudio(event.data.url)
      },timeInFuture);
    })

    setTimeout(() => play(events),2000)
  }
  
  const addEvent = (data) => {
    events.push({time: Date.now(), data: data})
    // console.log("events: ", events);
    // console.log("pitch: ", pitch);
    setEvents(events)
  }
    const toggleRecording = () => {
        if(isRecording){
            setIsRecording(false)
            console.log("events: ", events);
        } else {
            setIsRecording(true)
            setEvents([]);
            setStart(Date.now())
        }
    }
  return (
    <main onKeyPress={e => { console.log(e.key); playAudioFromKeyboard(drumData, e.key); }}>
      <div className="pad">
      {drumData
        .map(data => <DrumPad getIsRecording={getIsRecording}
                              addEventHandler={addEvent} 
                              key={data.id} data={data} 
                              onHit={playAudioFromDrumPad} />)}
      </div>
      <div style={{width: "100%", textAlign:"center"}}>
        <RecordButton getIsRecording={getIsRecording} onRecord={toggleRecording}/>
        <PlayButton onPlay={() => play(getEvents())}/>
      </div>
    </main>
  );
};

export default App;
