import Session from './Session'
import {useEffect, useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import {ethnicities, disabilities, identities} from './Misc';

function Survey(){
    const [data, setData] = useState({
        ethnicity: [],
        disability: [],
        identity: []
    })

    const ref = useRef([])
    /*for(let eth of ethnicities){
        ref.current.push()
    }*/

    const navigate = useNavigate()
    let eths = ethnicities
    let dis = disabilities
    let ids = identities

    useEffect(() => {
        Session.validateLogin().then((res) => {
            if(res === false)
              navigate("/login")
        })
    }, [])

    /*useEffect(() => {
        console.log(data)
    }, [data])*/

    const handleChange = (value, type, e) => {
        if(data[type].includes(value)){
            setData({
                ...data,
                [type]: data[type].filter((val) => (val != value))
            })
        }
        else{
            let arr = data[type]
            arr.push(value)
            setData({
                ...data,
                [type]: arr
            })
        }
    }


    const handleTxtChange = (e, type, value, i, arr) => {

        arr[i][1] = e.target.value 
        let vals = data[type]
        vals = vals.filter((v) => v != value)
        vals.push(e.target.value)
        setData({
            ...data,
            [type]: vals
        })
    }

    const handleSub = () => {
        Session.sendMail({
            subject: `A Family Filled the Survey`,
            text: `
            <p style="font-size: 2rem">Ethnicity: ${data.ethnicity}</p>
            <p style="font-size: 2rem">Disabilities: ${data.disability}</p>
            <p style="font-size: 2rem">Identities: ${data.identity}`,
        }).then((res) => {
            navigate("/success")
        })
    }

    return(
        <>  
            <div className="container">
                <p className="container-header">Family Survey</p>
            </div>
            <div className="container">
                <p className="container-text" style={{margin:"15px"}}>Thank you for taking the time to tell us a little bit more about your family. Your responses will help us better understand who we serve and will help us continue to improve our programs to best meet the needs of our families.</p>
                <p className="container-text" style={{margin:"15px"}}>The questions below are voluntary. You can choose ‘prefer not to answer’ to any or all questions. This survey is also anonymous. The information provided below will not be connected to any individual or family. </p>
                <p className="container-text" style={{margin:"15px"}}>Read the FAQ <a href='/FAQ.pdf'>here.</a></p>
            </div>
            <div className="container">
                <div className="container-text" style={{margin:"15px"}}><b>Thinking of yourself and the members of your family staying at the House, which of the following best describe your racial or ethnic group(s)? Check ALL that apply to your family.</b></div>
                    {eths.map((eth, i) => (
                        <>
                        <div className="button-container" style={{flexDirection:"row", marginTop:"20px"}}>
                            <input type="checkbox" className="checkbox" checked={data.ethnicity.includes(eth[1])} onChange={(e) => {handleChange(eth[1], "ethnicity",e)}} style={{minWidth:"30px", minHeight:"30px"}} />
                            <p className="container-text">{eth[0]}</p>
                        </div>
                        {eth[2] != 1 ? <></> :
                            <>
                                <p className="container-text">Input here: <input type="text" className="inline-form" value={eth[1]} onChange={(e) => {handleTxtChange(e, "ethnicity", eth[1], i, eths)}} /></p>              
                            </>
                        }
                        </>
                    ))}
                    <div className="button-container" style={{marginTop:"15px"}}></div>             
            </div>
            <div className="container">
                <div className="container-text" style={{margin:"15px"}}><b>Do you, or any of your family members staying with RMHC, have any of the following disabilities? Check ALL that apply to your family.</b></div>
                    {dis.map((disability, i) => (
                        <>
                        <div className="button-container" style={{flexDirection:"row", marginTop:"20px"}}>
                            <input type="checkbox" className="checkbox" checked={data.disability.includes(disability[1])} onChange={(e) => {handleChange(disability[1], "disability",e)}} style={{minWidth:"30px", minHeight:"30px"}} />
                            <p className="container-text">{disability[0]}</p>
                        </div>
                        {disability[2] != 1 ? <></> :
                            <>
                                <p className="container-text">Input here: <input type="text" className="inline-form" value={disability[1]} onChange={(e) => {handleTxtChange(e, "disability", disability[1], i, dis)}} /></p>              
                            </>
                        }
                        </>
                    ))}
                    <div className="button-container" style={{marginTop:"15px"}}></div>             
            </div>
            <div className="container">
                <div className="container-text" style={{margin:"15px"}}><b>Do you, or any of your family members staying with RMHC, identify as any of the following? Check ALL that apply to your family.</b></div>
                    {ids.map((id, i) => (
                        <>
                        <div className="button-container" style={{flexDirection:"row", marginTop:"20px"}}>
                            <input type="checkbox" className="checkbox" checked={data.identity.includes(id[1])} onChange={(e) => {handleChange(id[1], "identity",e)}} style={{minWidth:"30px", minHeight:"30px"}} />
                            <p className="container-text">{id[0]}</p>
                        </div>
                        {id[2] != 1 ? <></> :
                            <>
                                <p className="container-text">Input here: <input type="text" className="inline-form" value={id[1]} onChange={(e) => {handleTxtChange(e, "identity", id[1], i, ids)}} /></p>              
                            </>
                        }
                        </>
                    ))}
                    <div className="button-container" style={{marginTop:"15px"}}></div>             
            </div>
            <div className="container">
                <button className="button" onClick={() => {handleSub()}}>Submit</button>
            </div>
        </>
    )
}

export default Survey

