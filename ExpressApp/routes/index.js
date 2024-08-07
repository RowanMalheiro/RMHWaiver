var express = require('express');
const nodemailer = require('nodemailer')
require('dotenv').config()
const mongoose = require('mongoose')
const uri = process.env.DBURL
mongoose.connect(uri)
const Schema = mongoose.Schema
const userSchema = new Schema({
    userName:{
        type: String,
        required: true
    },
    passWord:{
        type: String,
        required:true
    }
})


var router = express.Router();

const getModel = ()=> {
    return mongoose.model('User', userSchema)
}

router.get("/", (req, res) => {
    res.send("Hiii :3")
})

router.post('/validate', function(req, res){
    console.log("hiii")
    const User = getModel()
    User.findOne({userName:req.body.user}).then((result) => {
        console.log(result)
        result===null ? res.send(false) : res.send(result.passWord === req.body.pass)
    })
})


router.post('/sendmail', async (req, res) => {

    console.log(process.env.EMAILPASS)
    console.log(process.env.EMAILS)

  const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: "rmhomailer@gmail.com",
          pass: process.env.EMAILPASS
      }
  })

   await sendMail(req, transporter)
   res.send(true)
})

module.exports = router;

async function sendMail(req, transporter){
    let options
    let emails = process.env.EMAILS.split(",")

    for(let email of emails){
        options = {
            from: 'rowan.malheiro@live.ca',
            to: email,
            subject: req.body.subject,
            html: req.body.text+'<img src="cid:unique@cid"/>',
            
        }
        req.body.signature != "" ? options = {...options, attachments: {
                filename: "signature.png",
                path: req.body.signature,
                cid: 'unique@cid'
            }} : options.attachments=options.attachments
            
        
        transporter.sendMail(options).then((resp) => {console.log(resp)})
        }
}
