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

    return {
        validateLogin: validateLogin,
    }
})()

export default Session