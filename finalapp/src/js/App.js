import '../css/App.css';
import React from 'react';
import {useEffect} from 'react'
import Header from './Header'
import Selection from './Selection';

function App() {
  return (
    <div className='app'>
      <Header></Header>
      <Selection></Selection>
    </div>
  );
}

export default App;
