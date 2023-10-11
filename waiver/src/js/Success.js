import React from 'react'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

function Success(){
    const [timeRemaining, setTimeRemaining] = useState(5);
    var rOnce = 1, time = 5
    const navigate = useNavigate()


    useEffect(() => {
        if(rOnce == 0) return
        rOnce--       
        runTimer();
    }, [])

    const runTimer = () => {
        setTimeout(() => {
            time--
            setTimeRemaining(time)

            if(time == 0){
                navigate("/")
            }

            runTimer()
            
        }, '1000')
    }

    return(
    <div className="container">
        <div className="text-container" style={{marginLeft:"auto", marginRight:"auto"}}>
        <p className="container-header">Success!</p>
            <p className="container-text" style={{marginBottom: "20px"}}>Redirecting in {timeRemaining}</p>
        </div>
    </div>
    ) 
}

export default Success