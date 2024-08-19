import axios from 'axios'

const Session = (() => {
    const validateLogin = async () => {
        let user = localStorage.getItem("username")
        let pass = localStorage.getItem("password")

        return new Promise((resolve, rej) => {
            axios.post('https://us-central1-rmho-53c23.cloudfunctions.net/api/validate',  {
                user: user,
                pass: pass
            }).then((res) => {
                resolve(res.data)
            })
        })
    }

    const sendMail = async (emailDetails) => {
        return new Promise((resolve) => {
            axios.post('https://us-central1-rmho-53c23.cloudfunctions.net/api/sendmail', emailDetails).then((res) => {
                resolve(res)
            })
        })
        
    }

    return {
        validateLogin: validateLogin,
        sendMail: sendMail
    }
})()

export default Session