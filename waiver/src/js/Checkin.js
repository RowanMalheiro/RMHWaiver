import { Formik, Field, Form } from 'formik';
import React, { useState } from 'react';

function Checkin(){
    const [border, setBorder] = useState(100)

    const validateCheck = (value) => {
        let error;
        if(value.length<1){
            error="Required!"
        }
        setBorder("red")
        return error
    }

    const validateName = (value) => {
        let error
        if(!value){
            error = "Invalid name!"
        }
        return error
    }

    return(
        <Formik
            initialValues={{
                checked: [],
                name: "",
            }}
            //validationSchema=""
            onSubmit={async (values) => {
                console.log(values)
            }}
        >{({ errors, touched, isValidating }) => (
            <Form>
                <>
                <div className="container">
                    <p className="container-header">Family Agreement</p>
                </div>
                <div className="container">
                <div className='button-container'>
                    <Field className="checkbox" type="checkbox" name="checked" value="one" validate={validateCheck}></Field>
                    <p className="container-text">I have read and agreed to the house policy and rules as stated in the<a href="./Policy.pdf">Guest Families Conduct & Responsibilities Policy</a></p>
                </div>
                    <p className="error-text">{errors.checked}</p>
                </div>
                <div className="container">
                    <p className="container-text">I, <Field className="inline-form" name="name" id="name" validate={validateName}/> acknowledge that I have read the Guest Families Conduct & Responsibilities Policy and I have had the opportunity to discuss any questions or concerns I may have about the contents, meaning and effect of this policy.</p>
                    <p className="error-text">{errors.name}</p>
                </div>
                <button type="submit">submit</button>
                </>
            </Form>

        )}
        </Formik>
    )
}

export default Checkin