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
    if(config.isTesting){
        res.send(true);
        return;
    }
    if(req.body.user == process.env.CRED_USER && req.body.pass == process.env.CRED_PASS){
        res.send(true);
    }
    else {
        res.send(false);
    }
});


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

    if(config.isTesting){
        emails = ['rowan.malheiro@live.ca'];
    }

    for(const email of emails){
        options = {
            from: 'rowan.malheiro@live.ca',
            to: email,
            subject: req.body.subject,
            html: req.body.text,
        }

        if(req.body.signature){
            options = {
                ...options,
                html: req.body.signature ? req.body.text+'<img src=\"cid:unique@cid\"/>' : req.body.text,
                attachments: {
                    filename: "signature.png",
                    path: req.body.signature,
                    cid: 'unique@cid'
                }
            };
        }

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