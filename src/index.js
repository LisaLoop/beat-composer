import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {bankOne} from './sound-banks'

ReactDOM.render(
  <React.StrictMode>
   <App drumData={bankOne}/>
  </React.StrictMode>,
  document.getElementById('root')
);
