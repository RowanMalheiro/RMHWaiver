import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function Login(){
    const [userName, setUserName] = useState("")
    const [pass, setPass] = useState("")
    const [displayPass, setDisplayPass] = useState("")
    const [scale, setScale] = useState(0)
    const navigate = useNavigate()

    const handleSub = () => {
        console.log(userName + pass)
        axios.post("https://us-central1-rmho-53c23.cloudfunctions.net/api/validate",  {
            user: userName,
            pass: pass
        }).then((res) => {
            console.log(res)
            if(res.data === true){
                localStorage.setItem("username", userName)
                localStorage.setItem("password", pass)
                navigate("/")
            }
            else{
                setScale(1)
            }
        })
    }

    const handlePassChange= (e) => {
        e.target.value.length > pass.length ? setPass(pass + e.target.value.slice(-1)) : setPass(e.target.value.length === 0 ? "" : pass.substring(0,e.target.value.length)) 
        setDisplayPass(e.target.value.length == 0 ? "" : '*'.repeat(e.target.value.length - 1) + e.target.value.slice(-1))
    }

    return(
        
        <>
            <div className="container">
                <div className="container-header" style={{marginBottom:"20px"}}>Login</div>
                <div className="container-text" style={{textAlign:"center"}}>Username</div>
                <div className="login-text-cont">
                    <input type="text" className='inline-form' style={{minWidth:"50%", height:"30px"}} value={userName} onChange={(e) => {setUserName(e.target.value)}} />
                </div>
                <div className="container-text" style={{textAlign:"center"}}>Password</div>
                <div className="login-text-cont">
                    <input type="text" className='inline-form' style={{minWidth:"50%", height:"30px"}} value={displayPass} onChange={(e) =>  handlePassChange(e)} />
                </div>
                <p className="error-text" style={{scale:`${scale}`, textAlign:"center", margin:"0px"}}>Incorrect username/password</p>
                <div className="button" onClick={() => handleSub()}>Submit</div>
            </div>
        </>
    )
}

export default Login