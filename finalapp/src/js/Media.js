import React, { useState, useRef, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas'
import Popup from 'reactjs-popup';
import axios from 'axios'

function Media(){

    const popRef = useRef({})
    const sigCanvas = useRef()
    const sigPopRef = useRef()

    const [sigError, setSigError] = useState("Invalid Signature!")

    const navigate = useNavigate()

    var opa = 0, signature="";

    const closePopup = () => {
        console.log(opa)
        popRef.current.close()
    }

    const validateCheck = (value) => {
        let error;
        if(value.length<4){
            error="All Checkboxes Required!"
        }
        return error
    }
    
    const validateName = (value) => {
        let error
        if(value == ""){
            error = "Invalid Name!"
        }
        return error
    }

    const handleSub = (errs) => {
        if(Object.keys(errs) != 0) {
            popRef.current.open()
        }
    }

    const validateSignature = (sig) => {
        let error = ""
        if(sig == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC" || sig == ""){
            error = "Invalid signature!"
        }
        console.log(sig)
        return error
        
    }

    const saveSignature = () => {
        const sig = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        signature=sig
        setSigError(validateSignature(sig))
        console.log(sig)
        sigPopRef.current.close()
        console.log(signature)
    }

    const sendEmail = async (data) => {
        const response = await axios.post('https://rmhwaiver.azurewebsites.net/sendmail', {
            to: 'zmarcgd@gmail.com',
            subject: `MEDIA CONFIRMATION for ${data.PName}`,
            text: `<p style="font-size:2rem;">${data.PName} has succesfully filled the media release form</p> 
            <p style="font-size:2rem;">Child's Name(s): ${data.CName}</p>`,
            signature: signature
        })
    }

    const returnToHome = () => {
        console.log("redirecting")
        navigate("/success")
    }
    

    return(
        <>
            <Formik
            initialValues={{
                checked: [],
                PName: "",
                CName: "",
            }}
            onSubmit={async (values) => {
                if(sigError == ""){
                    sendEmail(values)
                    returnToHome()
                }
                
            }}
        >{({ errors, touched, isValidating }) => (
            <Form>
                <Popup ref={popRef} position="top center">
                    <div className="darkenback" onClick={closePopup}>
                    <div className="container">
                        <p className="submit-err">Invalid submission!</p>
                    </div>
                    </div>
                </Popup>
                <div className="container">
                    <p className="container-header">Photo, Video and Story Release Form</p>
                </div>
                <div className="container">
                    <div className='button-container'>
                        <div className="checkCont">
                            <Field className="checkbox" type="checkbox" name="checked" value="one" validate={validateCheck}></Field>
                        </div>
                        <div className="bmarg">
                            <p className="container-text">I hereby authorize Ronald McDonald House Charities Ottawa to publish photographs or video taken of my family, a story I have personally shared, and our names, for use in RMHC Ottawa printed publications, social media and website.</p>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className='button-container'>
                        <div className="checkCont">
                            <Field className="checkbox" type="checkbox" name="checked" value="three" validate={validateCheck}></Field>
                        </div>
                        <div className="bmarg">
                            <p className="container-text">I acknowledge that since my participation in publications and websites produced by RMHC Ottawa is voluntary, I will receive no financial compensation</p>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className='button-container'>
                        <div className="checkCont">
                            <Field className="checkbox" type="checkbox" name="checked" value="four" validate={validateCheck}></Field>
                        </div>
                        <div className="bmarg">
                            <p className="container-text">I release RMHC Ottawa, its board members and its employees from liability for any claims by me or any third party in connection with my participation</p>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className='button-container'>
                        <div className="checkCont">
                            <Field className="checkbox" type="checkbox" name="checked" value="two" validate={validateCheck} width="15px"></Field>
                        </div>
                        <p className="container-text">I understand that these photos, videos and/or stories may be used to promote or fundraise for the Family Centered Care Programs offered at Ronald McDonald House Charities Ottawa on forums such as, but not limited to Facebook/Twitter/Instagram, print materials and advertising for Ronald McDonald House Charities Ottawa.</p>
                    </div>
                    <p className="error-text">{errors.checked}</p>
                </div>
                <div className="container">
                    <div className="button-container">
                        <p className="container-text">Parent/Guardian Name </p>
                        <Field className="inline-form" name="PName" validate={validateName}></Field>
                        <p className="container-text">Child/Childrens Name(s) </p>
                        <Field className="inline-form" name="CName" validate={validateName}></Field>
                    </div>
                    <div className="button-container">
                        <p className="error-text" style={{marginLeft: "auto", marginRight: "auto"}}>{errors.PName}</p>
                        <p className="error-text" style={{marginLeft: "auto", marginRight: "auto"}}>{errors.CName}</p>
                    </div>
                    
                </div>
                <div className="container">
                    <Popup
                        trigger={(
                            <button className="button" type="button"onClick={(e) =>{e.preventDefault()}}>Signature</button>
                        )}
                        position="top center"
                        closeOnDocumentClick
                        ref = {sigPopRef}
                        >
                            <div className="container" style={{width: "100vw"}}><SignatureCanvas ref={sigCanvas} width="100%" /><button onClick={saveSignature} className='button'>Submit</button></div>
                        </Popup>
                        <p className="error-text" style={{marginLeft: "auto", marginRight: "auto"}}>{sigError}</p>
                </div>
                <div className="container">
                    <button type="submit" className="button" onClick={() => handleSub(errors)}>Submit</button>
                </div>
            </Form>
            
        )}
        </Formik>
        </>
    )
}

export default Media