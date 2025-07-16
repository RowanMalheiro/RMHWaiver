import React from 'react';
import {useState, useEffect} from 'react'

function Selection(){

    return(
        <div className="container" >
            <div className='button-container'>
                <a href="/checkin" className="button">Attestation Form</a>
                <a href="/media" className="button">Media Release</a>
                <a href="/survey" className="button">Family Survey</a>
                <a href="/payment" className="button">3rd Party Payment</a>
            </div>
        </div>
    )
}

export default Selection;