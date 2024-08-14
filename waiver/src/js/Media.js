import React, { useState, useRef, useEffect } from 'react';
import MediaAccept from './MediaAccept';
import Session from './Session'
import { useNavigate } from 'react-router-dom';

function Media(){
    const navigate = useNavigate()

    useEffect(() => {
        Session.validateLogin().then((res) => {
            if(res === false){
              navigate("/login")
            }
        })
    }, [])

    return(
       <>
        <div className="container">
            <div className="container-header" style={{marginBottom:"10px", marginTop:"15px"}}>Media Release Form</div>
                <div className="container-text" style={{textAlign:"center", marginBottom:"5px"}}>This is an optional form.</div>  
        </div>
        <MediaAccept></MediaAccept>
        
       </> 
    )
}

export default Media