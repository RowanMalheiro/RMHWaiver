import { useEffect, useState, useRef} from "react";
import { useNavigate } from "react-router-dom";
import Session from "./Session";
const divName = "payment-div"

let dcview, buffer, saved

function Payment(){
    const [errorSize, setErrorSize] = useState("0px");
    const navigate = useNavigate();
    useEffect(() => {
        handleAdobeEmbed();
    }, []);
    
    const handleAdobeEmbed = async () => {
        dcview = await Session.getAdobeView(divName);
        dcview.previewFile({
            content:{location: {url: "/payment.pdf"}},
            metaData:{fileName: "payment.pdf"},
        });
        dcview.registerCallback(
            window.AdobeDC.View.Enum.CallbackType.SAVE_API,
            handleSave
        );
    }

    const handleSave = async (metaData, content, options) => {
        saved = true;
        console.log('handling save');
        buffer = content;
        
        return {
            code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
            data: {
              metaData: Object.assign(metaData, {fileName: "edited.pdf"})
            }
        }
    }

    const handleSub = async () => {
        console.log(saved);
        console.log(buffer);
        if(saved === false){
            setErrorSize("3vh");
            return;
        }
        await Session.sendMail({
            subject: 'Third Party Payment Info Submitted',
            text: `<p style="font-size: 2rem">New Third Party Payment Information form has been submitted. It has been attached to this email as a PDF file.</p> `,
            pdfAttachment: buffer
        }).catch((err) => console.log(err));

        navigate("/success");
    }

    return (
        <>
        <div id={divName} style={{height: "80vh", border: "black solid 2px"}}></div>
        <div className="container" style={{borderTopWidth: "5vh", marginTop: "3vh"}}>
            <button className="button" onClick={handleSub} >Submit</button>
            <p className='error-text' style={{fontSize:errorSize, textAlign: 'center', margin: '0px'}}>You need to save first!</p>
        </div>
        </>
    );

}

export default Payment;