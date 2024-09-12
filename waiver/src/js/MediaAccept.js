import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'
import Popup from 'reactjs-popup';
import Session from './Session';

function MediaAccept(){
    const [data, setData] = useState({
        parentName:"",
        children:["",""]
    })
    const [sigError, setSigError] = useState("Fill your signature!")
    const [signature, setSignature] = useState("")
    const [selectedChecks, setSelectedChecks] = useState([false,false])
    const [checkError, setCheckError] = useState('Select an option!')
    const sigCanvas = useRef({})
    const sigBox = useRef({})
    const navigate = useNavigate()

    useEffect(() => {
        if(selectedChecks[0] === false && selectedChecks[1] === false){
            setCheckError('Select an option!')
        }
        else{
            setCheckError('')
        }
    }, [selectedChecks])

    const handleChildChange = (i, newValue) => {
        let newChildren = data.children
        newChildren[i] = newValue
        setData({
            ...data,
            children:newChildren
        })
    }

    const handleSub = async (errs) => {
        if(validate() === false){
            return
        }
        sendEmail()
        navigate("/success")
    }

    const validate = () => {
        return sigError === "" && checkError === ''
    }

    const sendEmail = async () => {
        const response = selectedChecks[0] === true 
        ? await Session.sendMail({
            subject: `Media Form ACCEPTED by ${data.parentName}`,
            text: `<p style="font-size: 2rem">${data.parentName} has accepted the media form</p> 
            <p style="font-size: 2rem">For children: ${data.children}</p>`,
            signature: signature
        })
        : await Session.sendMail({
            subject: `Media Form DECLINED by ${data.parentName}`,
            text: `<p style="font-size: 2rem">${data.parentName} has declined the media form</p> 
            <p style="font-size: 2rem">For children: ${data.children}</p>`,
            signature: signature
        })
        return new Promise((resolve) => {resolve(response)})
    }

    const saveSignature = () => {
        const sig = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        setSignature(sig)
        setSigError(validateSignature(sig))
        sigBox.current.close()
    }

    const validateSignature = (sig) => {
        let error = ""
        if(sig == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC" || sig == ""){
            error = "Invalid signature!"
        }
        return error
    }

    const handleChange = (e, i) => {
        let checks = [false,false]
        checks[i] = e.target.checked
        setSelectedChecks(checks)
    }

    return(
        <>
            <div className="container">
                <div className="button-container">
                    <p className="container-text">I agree with the following text:</p>
                </div>
                <p className="container-text" style={{marginTop:"15px"}}>I hereby authorize Ronald McDonald House Charities Ottawa to publish photographs or video taken of my family, a story I have personally shared, and our names, for use in RMHC Ottawa printed publications, social media and website. </p>
                <p className="container-text" style={{marginTop:"15px"}}>I acknowledge that since my participation in publications and websites produced by RMHC Ottawa is voluntary, I will receive no financial compensation.</p>
                <p className="container-text" style={{marginTop:"15px"}}>I release RMHC Ottawa, its board members and its employees from liability for any claims by me or any third party in connection with my participation.</p>
                <p className="container-text" style={{marginTop:"15px", marginBottom:"15px"}}>I understand that these photos, videos and/or stories may be used to promote or fundraise for the Family Centered Care Programs offered at Ronald McDonald House Charities Ottawa on forums such as, but not limited to Facebook/Twitter(X)/Instagram, print materials and advertising for Ronald McDonald House Charities Ottawa.</p>
            </div>
            <div className="container">
                <div style={{marginBottom:"5px", marginTop:"5px"}} className="text-container">
                    <div  className="container-text">Parent/Guardian Name: <input type="text" value={data.parentName} onChange={(e) => {setData({...data, parentName:e.target.value})}} className="inline-form" /> <button className="button" style={{scale:"0.8", marginTop:"0px"}} onClick={() => setData({...data, children:data.children.concat("")})}>Add Child</button> <button className="button" style={{scale:"0.8", marginTop:"0px"}} onClick={() => setData({...data, children:data.children.slice(0,data.children.length-1)})} >Remove Child</button> </div>   
                </div>
                {data.children.map((child, i) => (
                        <div className="textContainer">
                            <div className="container-text" style={{marginBottom:"5px"}}>Child {i+1}: <input type="text" className="inline-form" value={child} onChange={(e) => {handleChildChange(i, e.target.value)}} /></div>
                        </div>   
                ))}
                <Popup
                        trigger={(
                            <button className="button" style={{marginBottom:"0px", scale:"0.8"}}>Signature</button>
                        )}
                        position="top center"
                        closeOnDocumentClick
                        ref={sigBox}
                        >
                            <div className="container" style={{width: "100vw"}}><SignatureCanvas ref={sigCanvas}/><button onClick={saveSignature} className='button'>Submit</button></div>
                </Popup>
                <p className="error-text" style={{textAlign:"center", marginBottom:"5px"}}>{sigError}</p>
            </div>
            <div className="container">
                <div className="button-container">
                    <input type="checkbox" className="checkbox" checked={selectedChecks[0]} onChange={(e) => handleChange(e,0)} />
                    <p className="container-text">I agree to the Media Release form</p>
                </div>
                <div className="button-container" style={{marginBottom:"15px"}}>
                    <input type="checkbox" className="checkbox" checked={selectedChecks[1]} onChange={(e) => handleChange(e,1)} />
                    <p className="container-text">I do not agree to the Media Release form</p>
                </div>
                <p className="error-text" style={{textAlign:"center", marginBottom:"5px"}}>{checkError}</p>
            </div>
            <div className="container">
                <button className="button" onClick={handleSub}>Submit</button>
            </div>
        </>
    )
}

export default MediaAccept