const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
const hpp = require("hpp");
require("dotenv").config();

// Let the app use cors as middleware
const corsOptions = {
  origin: 'https://nazanajemba.vercel.app',
};
app.use(express.json());
// app.use(cors({ origin: "*", credentials: true}));
app.use(cors(corsOptions));
app.use(hpp());

// Nodemailer setup for transporter object
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    pass: process.env.WORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take your messages: ${success} ===`);
});

// Routing the nodemailer for accessibility through the Frontend
app.get("/", function(req, res){
    res.send("Welcome to NazPortpolio API.")
})
app.post("/send", function (req, res) {
  // Nodemailer setup for mailOptions object
  let mailOptions = {
    from: req.body.mails.emailValue, // Use emailValue instead of mails.emailValue
    to: process.env.EMAIL,
    subject: `Naz Portfoliio Message from ${req.body.mails.emailValue}`, // Use emailValue instead of mails.emailValue
    text: `NAME: ${req.body.mails.nameValue}\n\nCONNECT: ${req.body.mails.connectValue}\n\nMESSAGE: ${req.body.mails.messageValue}\n\n\n\nHappy 🎉  Hacking Champ!`, // Use messageValue instead of mails.messageValue
  };

  // Nodemailer setup for sendMail method
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      res.json({ status: "fail" });
    } else {
      console.log(`=== Message sent successfully! ===`);
      res.json({ status: "success" });
    }
  });
});

// Run the server on port 4040
const port = +process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;