import { Formik, Field, Form } from 'formik';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas'
import Popup from 'reactjs-popup';
import axios from 'axios'
import Session from './Session'

function Checkin(){
    const [signature, setSignature] = useState("")
    const [sigError, setSigError] = useState("Invalid signature!")
    const [emailDetails, setEmailDetails] = useState({
        checked: [],
        name: "",
        email: "",
        phone: "",
    })

    const sigCanvas = useRef({})
    const formik = useRef({})
    const popRef = useRef({})

    const navigate = useNavigate()

    useEffect(() => {
        Session.validateLogin().then((res) => {
          if(res === false){
            navigate("/login")
          }
        })
      }, [])

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
            error = "Invalid entry!"
        }
        return error
    }

    const saveSignature = () => {
        const sig = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        setSignature(sig)
        setSigError(validateSignature(sig))
      };

    const validateSignature = (sig) => {
        let error = ""
        if(sig == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC" || sig == ""){
            error = "Invalid signature!"
        }
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

    const handleSub = async (errs) => {
        if(Object.keys(errs).length != 0 || sigError != "") {
            popRef.current.open()
            return
        }
        sendEmail(emailDetails)
        returnToHome()
    }

    const closePopup = () => {
        popRef.current.close()
    }

    const returnToHome = () => {
        navigate("/success")
    }

    const sendEmail = async (data) => {
        const response = await axios.post('https://us-central1-rmho-53c23.cloudfunctions.net/api/sendmail', {
            subject: `ATTESTATION CONFIRMATION for ${data.name}`,
            text: `<p style="font-size: 2rem">${data.name} has succesfully filled the attestation form</p> 
            <p style="font-size: 2rem">Phone: ${data.phone}</p>
            <p style="font-size: 2rem">Email: ${data.email}</p>
            <p style="font-size: 2rem"> Car Make: ${data.make} Colour: ${data.carColour} License Plate: ${data.plate}`,
            signature: signature
        })
        return new Promise((resolve) => {resolve(response)})
    }

    const carErrors = (errs) => {
        let carErrs = [0,0,0]
        for(let key of Object.keys(errs)){
            if(key === "make"){
                carErrs[0] = 1
            }
            else if(key==="plate"){
                carErrs[1] = 1
            }
            else if(key==="carColour"){
                carErrs[2] = 1
            }
        }
        if(carErrs[0] != 0 || carErrs[1] != 0 || carErrs[2] != 0){
            return(<><p className="error-text">Invalid entry!</p></>)
        }
        else{
            return(<></>)
        }
    }
    

    return(
        <Formik
            initialValues={{
                checked: [],
                name: "",
                email: "",
                phone: "",
                carMake: "",
                carColour: "",
                plate: ""
            }}
            onSubmit={(values) => {
                console.log(values)
                setEmailDetails(values)
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
                        <div className='button-container' style={{flexDirection:"row", marginTop:"15px"}}>
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
                    <div className="container-text" style={{scale:"1"}}>Car Details:</div>
                    <div className="text-container">
                        <p className="container-text" style={{marginBottom:"10px"}}>Car Make: <Field className="inline-form" name="make" id="make" validate={validateName}></Field></p>
                        <p className="container-text" style={{marginBottom:"10px"}}>Car colour: <Field className="inline-form" name="carColour" id="carColour" validate={validateName}></Field></p>
                        <p className="container-text" style={{marginBottom:"10px"}}>License Plate: <Field className="inline-form" name="plate" id="plate" validate={validateName}></Field></p>
                        {carErrors(errors)}
                    </div>
                    
                </div>
                <div className="container">
                    <div className="button-container">
                    <div className="field-container"><p className='container-text'>Email: </p><Field className="inline-form" name="email" validate={validateEmail}></Field></div>
                        <Popup
                        trigger={(
                            <button className="button" onClick={(e) => {e.stopPropagation()}}>Signature</button>
                        )}
                        position="top center"
                        closeOnDocumentClick
                        >
                            <div className="container" style={{width: "100vw"}}><SignatureCanvas ref={sigCanvas}  /><button onClick={saveSignature} className='button'>Submit</button></div>
                        </Popup>
                            <div className="field-container" ><p className='container-text'>Phone: </p><Field className="inline-form" name="phone" validate={validatePhone}></Field></div></div>
                    <div className="button-container">
                        <p className="error-text" style={{marginLeft: "auto", marginRight: "auto"}}>{errors.email}</p>
                        <p className="error-text" style={{marginLeft: "auto", marginRight: "auto"}}>{sigError}</p>
                        <p className="error-text" style={{marginLeft: "auto", marginRight: "auto"}}>{errors.phone}</p>    
                    </div>

                    <button type="submit" className="button" onClick={async () => handleSub(errors)}>Submit</button>

                </div>
                </>
            </Form>

        )}
        </Formik>
    )
}

export default Checkin