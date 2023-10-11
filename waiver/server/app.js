const nodemailer = require('nodemailer')
const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors())
app.use(express.json());

app.post('/sendmail', async (req, res) => {

    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: "rowan.malheiro@live.ca",
            pass: "Doogie11"
        }
    })
    
    const options = {
        from: 'rowan.malheiro@live.ca',
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.text+'<img src="cid:unique@cid"/>',
        attachments: {
            filename: "signature.png",
            path: req.body.signature,
            cid: 'unique@cid'
        }
    }
    
    transporter.sendMail(options, (err, info) => {
        if(err){
            console.log('err')
        }
    })
})

app.listen(3001, () => {
    console.log(`Server listening on 3001`);
})