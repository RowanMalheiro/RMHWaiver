import axios from 'axios'
import config from '../config.json'

const Session = (() => {
    let adobeListeningPromise;
    const validateLogin = async () => {
        let user = localStorage.getItem("username")
        let pass = localStorage.getItem("password")

        return new Promise((resolve, rej) => {
            axios.post('https://us-central1-rmho-53c23.cloudfunctions.net/api/validate',  {
                user: user,
                pass: pass
            }).then((res) => {
                resolve(res.data)
            }).catch((err) => {
                console.log(err);
                if(config.isTesting){
                    resolve(true);
                } else {
                    resolve(false);

                }
            })
        })
    }

    const sendMail = async (emailDetails) => {
        console.log('???');
        console.log(emailDetails);
        return new Promise((resolve) => {
            console.log(emailDetails);
            axios.post(config.isTesting ? 'http://localhost:8080/sendMail' : 'https://us-central1-rmho-53c23.cloudfunctions.net/api/sendmail', emailDetails).then((res) => {
                resolve(res)
            });
        })
    }

    const listenForAdobe = () => {
        console.log("setting up adobe listening");
        console.log(window.AdobeDC);
        adobeListeningPromise = new Promise((res) => {
            if(!window.AdobeDC){
                document.addEventListener('adobe_dc_view_sdk.ready', () => {
                    res();
                }, {});
            } else {
                res();
            }
        });
    }

    const getAdobeView = async (divId) => {
        await adobeListeningPromise;
        return new window.AdobeDC.View({
            clientId: config.isTesting ? config.adobeKeyTest : config.adobeKey,
            divId: divId
        });
    }

    return {
        validateLogin: validateLogin,
        sendMail: sendMail,
        listenForAdobe: listenForAdobe,
        getAdobeView: getAdobeView
    }
})()

export default Session