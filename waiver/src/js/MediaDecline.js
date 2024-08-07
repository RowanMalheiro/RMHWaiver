import {useState, useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

function MediaDecline(){
    const [data,setData] = useState({
        parentName:"",
        children:["", ""]
    })

    const navigate = useNavigate()

    const handleChildChange = (i, newValue) => {
        let newChildren = data.children
        newChildren[i] = newValue
        setData({
            ...data,
            children:newChildren
        })
    }

    const handleSub = async (errs) => {
        sendEmail()
        navigate("/success")
    }

    const sendEmail = async () => {
        for(let child of data.children){
            child=" " + child
        }

        const response = await axios.post('https://us-central1-rmho-53c23.cloudfunctions.net/api/sendmail', {
            subject: `Media Form DECLINED by ${data.parentName}`,
            text: `<p style="font-size: 2rem">${data.parentName} has declined the media form</p> 
            <p style="font-size: 2rem">For children: ${data.children}</p>`,
            signature: ""
        })
        return new Promise((resolve) => {resolve(response)})
    }

    return(
        <div className="container">
            <div style={{marginBottom:"5px", marginTop:"5px"}} className="text-container">
                <div  className="container-text">Parent/Guardian Name: <input type="text" value={data.parentName} onChange={(e) => {setData({...data, parentName:e.target.value})}} className="inline-form" /> <button className="button" style={{scale:"0.8", marginTop:"0px"}} onClick={() => setData({...data, children:data.children.concat("")})}>Add Child</button> <button className="button" style={{scale:"0.8", marginTop:"0px"}} onClick={() => setData({...data, children:data.children.slice(0,data.children.length-1)})} >Remove Child</button> </div>   
            </div>
            {data.children.map((child, i) => (
                    <div className="textContainer">
                        <div className="container-text" style={{marginBottom:"5px"}}>Child {i+1}: <input type="text" className="inline-form" value={child} onChange={(e) => {handleChildChange(i, e.target.value)}} /></div>
                    </div>   
            ))}
            <button className="button" onClick={handleSub}>Submit</button>
        </div>
    )
}

export default MediaDecline