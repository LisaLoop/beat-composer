import React from 'react'

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

export const playAudioFromDrumPad = ({ url }) => playAudio(url);

export const DrumPad = ({ data, onHit }) =>
  <button className="key" onClick={() => onHit(data)}>{data.id}</button>;
