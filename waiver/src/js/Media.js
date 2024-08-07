import React, { useState, useRef, useEffect } from 'react';
import MediaDecline from './MediaDecline';
import MediaAccept from './MediaAccept';
import Session from './Session'
import { useNavigate } from 'react-router-dom';

function Media(){

    const [form, setForm] = useState(() => (<></>))
    const [selectedChecks, setSelectedChecks] = useState([false,false])

    const navigate = useNavigate()

    const handleChange = (e, i) => {
        let checks = [false,false]
        checks[i] = e.target.checked
        setSelectedChecks(checks)
        console.log(selectedChecks)
    }

    const displayForm = () => {
        if(selectedChecks[0] === true){
            setForm(<MediaAccept/>)
        }
        else if(selectedChecks[1] === true){
            setForm(<MediaDecline/>)
        }
        else{
            setForm(<></>)
        }
    }

    useEffect(() => {
        Session.validateLogin().then((res) => {
            if(res === false){
              navigate("/login")
            }
        })
    }, [])

    useEffect(() => {
        displayForm()
    }, [selectedChecks])

    return(
       <>
        <div className="container">
            <div className="container-header" style={{marginBottom:"10px", marginTop:"15px"}}>Media Release Form</div>
                <div className="container-text" style={{textAlign:"center", marginBottom:"5px"}}>This is an optional form.</div>  
        </div>
        <div className="container">
            <div className="button-container">
                <input type="checkbox" className="checkbox" checked={selectedChecks[0]} onChange={(e) => handleChange(e,0)} />
                <p className="container-text">I wish to fill the Media Release form</p>
            </div>
            <div className="button-container" style={{marginBottom:"15px"}}>
                <input type="checkbox" className="checkbox" checked={selectedChecks[1]} onChange={(e) => handleChange(e,1)} />
                <p className="container-text">I do not wish to fill the Media Release form</p>
            </div>
        </div>
        {form}
       </> 
    )
}

export default Media