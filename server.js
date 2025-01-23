const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const validator = require('deep-email-validator');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

let savedOTPs ={};





app.get('/', (req, res) => {
  res.send('Hello, Server is running!');
});


//To Send OTP

app.post('/sendotp', async (req, res) => {
  const inputemail = req.body.email;

  const {valid, reason, validators} = await validator.validate(inputemail);
  if(!valid){
    return res.status(400).json({status:'fail', message: 'Invalid user E-Mail' });

  }


  // Generate 4-digit OTP
  let new_otp = '';
  for (let i = 0; i < 4; i++) {
    new_otp += Math.floor(Math.random() * 10);
  }
  console.log(`Generated OTP: ${new_otp}`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });


    const mailOptions = {
      from: process.env.EMAIL,
      to: inputemail,
      subject: 'OTP Verification using NodeMailer',
      text: 'Your OTP Verification Code',
      html: `<h1>Your OTP for Verification is ${new_otp}</h1>`
    };
    

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        return res.status(500).json({ status:'error',message: 'Error sending email, please try again later' });
      } else {
         savedOTPs[inputemail]=new_otp;
         setTimeout(()=>{
          delete savedOTPs[inputemail];
        },60000);
        
         return res.status(200).json({status:'success', message: 'OTP sent successfully' });
      }
    });

   

});

//To Verify OTP
app.post('/verifyotp',(req,res)=>{

  let useremail = req.body.email;
  let userotp = req.body.otp;

  if(savedOTPs[useremail]===userotp){
    console.log(useremail,userotp)
    return res.status(200).json({status:'success',message:'E-Mail verified Successfully.'})
  }
  else{
    return res.status(400).json({status:'fail',message:'Invalid OTP'})
  }

});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});











