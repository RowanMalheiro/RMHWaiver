import { Formik, Field, Form } from 'formik';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas'
import Popup from 'reactjs-popup';
import axios from 'axios'

function Checkin(){
    const [signature, setSignature] = useState("")
    const [sigError, setSigError] = useState("Invalid signature!")
    const [opa, setOpacity] = useState(0)

    const sigCanvas = useRef({})
    const formik = useRef({})
    const popRef = useRef({})
    const sigPopRef = useRef({})

    const navigate = useNavigate()

    const validateCheck = (value) => {
        let error;
        if(value.length<1){
            error="Required!"
        }
        return error
    }

    const validateName = (value) => {
        let error
        if(!value){
            error = "Invalid name!"
        }
        return error
    }

    const saveSignature = () => {
        const sig = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        setSignature(sig)
        setSigError(validateSignature(sig))
        sigPopRef.current.close()
      };

    const validateSignature = (sig) => {
        let error = ""
        if(sig == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC" || sig == ""){
            error = "Invalid signature!"
        }
        console.log(sig)
        return error
        
    }

    const validatePhone = (value) => {
        let re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/, error = '';
        if(!re.test(value)){
            error = 'Invalid phone!'
        }
        return error
    }

    const validateEmail = (value) => {
        let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error = ''
        if(!re.test(value)){
            error = 'Invalid email!'
        }
        return error
    }

    const handleSub = (errs) => {
        if(Object.keys(errs) != 0) {
            console.log("????")
            popRef.current.open()
        }
    }

    const closePopup = () => {
        console.log(opa)
        popRef.current.close()
    }

    const sendEmail = async (data) => {
        const response = await axios.post('https://rmhwaiver.azurewebsites.net/sendmail', {
            to: 'zmarcgd@gmail.com',
            subject: `ATTESTATION CONFIRMATION for ${data.name}`,
            text: `<p style="font-size:2rem;">${data.name} has succesfully filled the attestation form</p> 
            <p style="font-size:2rem;">Phone: ${data.phone}</p>
            <p style="font-size:2rem;">Email: ${data.email}</p>`,
            signature: signature
        })
    }

    const returnToHome = () => {
        console.log("redirecting")
        navigate("/success")
    }
    

    return(
        <Formik
            initialValues={{
                checked: [],
                name: "",
                email: "",
                phone: "",
            }}
            onSubmit={async (values) => {
                if(sigError == ""){
                    sendEmail(values)
                    returnToHome()

                }
            }}

            ref={formik}
        >{({ errors, touched, isValidating }) => (
            <Form>
                <>
                <Popup ref={popRef} position="top center">
                    <div className="darkenback" onClick={closePopup}>
                    <div className="container">
                        <p className="submit-err">Invalid submission!</p>
                    </div>
                    </div>
                </Popup>
                <div className="container">
                    <p className="container-header">Attestation Form</p>
                </div>
                    <div className="container">
                        <div className='button-container'>
                            <Field className="checkbox" type="checkbox" name="checked" value="one" validate={validateCheck}></Field>
                            <p className="container-text">I have read and agreed to the house policy and rules as stated in the <a href="./Policy.pdf">Guest Families Conduct & Responsibilities Policy</a>!!</p>
                        </div>
                        <p className="error-text">{errors.checked}</p>
                    </div>
                <div className="container">
                    <div className="text-container">
                        <p className="container-text">I, <Field className="inline-form" name="name" id="name" validate={validateName}/> acknowledge that I have read the Guest Families Conduct & Responsibilities Policy and I have had the opportunity to discuss any questions or concerns I may have about the contents, meaning and effect of this policy.</p>
                    </div>
                    <p className="error-text">{errors.name}</p>
                </div>
                    <div className="container">
                    <div className="button-container">
                    <div className="field-container"><p className='container-text'>Email: </p><Field className="inline-form" name="email" validate={validateEmail}></Field></div>
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
                            <div className="field-container" ><p className='container-text'>Phone: </p><Field className="inline-form" name="phone" validate={validatePhone}></Field></div></div>
                    <div className="button-container">
                        <p className="error-text" style={{marginLeft: "auto", marginRight: "auto"}}>{errors.email}</p>
                        <p className="error-text" style={{marginLeft: "auto", marginRight: "auto"}}>{sigError}</p>
                        <p className="error-text" style={{marginLeft: "auto", marginRight: "auto"}}>{errors.phone}</p>    
                    </div>

                    <button type="submit" className="button" onClick={() => handleSub(errors)}>Submit</button>

                    </div>
                </>
            </Form>

        )}
        </Formik>
    )
}

export default Checkin