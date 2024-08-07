import '../css/App.css';
import React from 'react';
import {useEffect} from 'react'
import Header from './Header'
import Selection from './Selection';
import Session from "./Session"
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate()
  useEffect(() => {
    Session.validateLogin().then((res) => {
      if(res === false){
        navigate("/login")
      }
    })
  })
  return (
    <div className='app'>
      <Header></Header>
      <div className="container">
        <div style={{height:"33.75vw", width:"60vw", margin:"4vh auto auto"}}>
          <iframe style={{width:"90%", height:"90%"}} width="560" height="315" src="https://www.youtube.com/embed/el8EMBwD5Qc?si=VqX55TI0OBXy582X&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
      
      </div>
      <div className="container">
        <img src="/Picture.png" alt="" style={{width:"95%"}} />
      </div>
      <Selection></Selection>
    </div>
  );
}

export default App;
