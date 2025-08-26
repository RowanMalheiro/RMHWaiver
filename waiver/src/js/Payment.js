import { useEffect, useState, useRef} from "react";
import { useNavigate } from "react-router-dom";
import Session from "./Session";
const divName = "payment-div"

let dcview, buffer, saved

function Payment(){
    const [error, setError] = useState(true);
    const [checks, setChecks] = useState({
        selfPayed: undefined,
        agency: "",
        contactName: "",
        contactEmail: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        if(checks.selfPayed === false && (checks.agency === '' || checks.contactEmail === '' || checks.contactEmail === '')){
            setError(true);
        }
        else{
            setError(false)
        }

    }, [checks])
    
    const handleChange = (e, val) => {
        let newChecks = {
            ...checks
        }
        newChecks[val] = e;
        setChecks(newChecks);
    }

    const handleSub = async () => {
        console.log(checks.selfPayed)
        await Session.sendMail({
            subject: 'Family Filled out Payment Form',
            text: `<p style="font-size: 2rem">Hello,</p>
            <p style="font-size: 2rem">The third party payment form has been filled out by a guest.</p> 
            <p style="font-size: 2rem">Will A Third party agency pay for their stay: ${checks.selfPayed  === false ? 'No' : 'Yes'}</p>
            ${checks.selfPayed === false ?
                `<p style="font-size: 2rem>Name of agency: ${checks.agency}</p>
                <p style="font-size: 2rem>Contact Person: ${checks.contactName}</p>
                <p style="font-size: 2rem>Contact Email: ${checks.contactEmail}</p>
                `
                : ''
            }`, 
        }).catch((err) => console.log(err));

        navigate("/success");
    }

    return (
        <>
            <div className="container">
                <div className="container-text" style={{textAlign:"center", marginTop:"20px"}}><b>Will a Third Party Agency be convering your stay at RMHC Ottawa?</b></div>
                <div className="button-container">
                    <input type="checkbox" className="checkbox" checked={checks['selfPayed'] === true} onChange={(e) => handleChange(true ,'selfPayed')}></input>
                    <div className="container-text">Yes</div>
                </div>
                <div className="button-container" style={{marginBottom:"10px"}}>
                    <input type="checkbox" className="checkbox" checked={checks['selfPayed'] === false} onChange={(e) => handleChange(false,'selfPayed')}></input>
                    <div className="container-text">I will be paying for my own stay</div>
                </div>

            </div>
            {
                checks.selfPayed === false ?
                    <>
                        <div className="container">
                            <div className="container-text" style={{marginTop:"15px"}}><b>Name of Third Party Agency:</b></div>
                            <input type="text" style={{marginLeft:"5px", marginRight:"20%", marginBottom:"15px"}} value={checks.agency} onChange={(e) => handleChange(e.target.value, "agency")} className="inline-form"></input>
                            <div className="container-text" style={{marginTop:"15px"}}><b>Contact Person:</b></div>
                            <input type="text" style={{marginLeft:"5px", marginRight:"20%", marginBottom:"15px"}} value={checks.contactName} onChange={(e) => handleChange(e.target.value, "contactName")} className="inline-form"></input>
                            <div className="container-text" style={{marginTop:"15px"}}><b>Contact Email:</b></div>
                            <input type="text" style={{marginLeft:"5px", marginRight:"20%", marginBottom:"15px"}} value={checks.contactEmail} onChange={(e) => handleChange(e.target.value, "contactEmail")} className="inline-form"></input>
                            <p className="error-text" style={{fontSize: error ? "20px" : "0px"}}>These fields are required!</p>
                        </div>
                    </> :
                    <></>
            }
            {
                checks.selfPayed !== undefined && error === false? 
                    <div className="container">
                        <button className="button" onClick={handleSub}>Submit</button>
                    </div>
                    :<></>
            }
        </>
    );

}

export default Payment;