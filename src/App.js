import React from 'react';
import {playAudioFromDrumPad, playAudioFromKeyboard, DrumPad} from './drum-machine'
import './App.css';

const App = ({ drumData }) => {
  console.log(JSON.stringify(drumData));
  return (
    <main onKeyPress={e => { console.log(e.key); playAudioFromKeyboard(drumData, e.key); }}>
      <div className="pad">
      {drumData
        .map(data => <DrumPad key={data.id} data={data} onHit={playAudioFromDrumPad} />)}
      </div>
    </main>
  );
};

export default App;
