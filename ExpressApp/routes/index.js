var express = require('express');
const nodemailer = require('nodemailer')
const config = require('../config.json');
require('dotenv').config()
const mongoose = require('mongoose')
const uri = process.env.DBURL

if(uri){
    mongoose.connect(uri)
}
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
    if(config.isTesting){
        res.send(true);
    }
    const User = getModel()
    User.findOne({userName:req.body.user}).then((result) => {
        console.log(result)
        result===null ? res.send(false) : res.send(result.passWord === req.body.pass)
    })
})


router.post('/sendmail', async (req, res) => {
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

async function sendMail(req, transporter){
    let options
    let emails = process.env.EMAILS?.split(",")
    console.log('huh');
    console.log(config);

    if(config.isTesting){
        console.log('istesting');
        emails = ['rowan.malheiro@live.ca'];
        console.log(emails)
    }

    for(let email of emails){
        options = {
            from: 'rowan.malheiro@live.ca',
            to: email,
            subject: req.body.subject,
            html: req.body.signature ? req.body.text+'<img src=\"cid:unique@cid\"/>' : req.body.text,
        }
        options = req.body.signature != "" ? {...options, attachments: {
                filename: "signature.png",
                path: req.body.signature,
                cid: 'unique@cid'
            }} : options;
        
        options = req.body.pdfAttachment ? {
            ...options,
            attachments: {
                filename: "Payment.pdf",
                content: req.body.pdfAttachment
            }
        } : options;

        console.log(options);

        return new Promise((res, rej) => {
            transporter.sendMail(options).then((resp) => {
                console.log(resp)
                res();
            }).catch((err) => {
                console.log(err)
                res();
            });
        });
    }
}

module.exports = router;