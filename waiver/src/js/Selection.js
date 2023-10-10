import React from 'react';
import {useState, useEffect} from 'react'

function Selection(){
    const [Hover, setHover] = useState(0);

    useEffect(()=>{
        console.log("sekectiond");
    }, [Hover])

    const handleEnter =(n)=>{
        setHover(n);
    }

    function getStyle(n){
        return n == Hover ? "darkred" : "red"
    }

    return(
        <div className="container" >
        <div className='button-container'>
            <a href="/checkin" className="button">Check in</a>
            <a href="/checkin" className="button">Check Out</a>
            <a href="/checkin" className="button">Media Release</a>
        </div>
        </div>
    )
}

export default Selection;