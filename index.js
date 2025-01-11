require('dotenv').config()
const express = require('express')
const app = express()
var cors = require('cors')
const nodemailer = require("nodemailer");


app.use(cors())
app.use(express.json());

app.post('/emailSend', async function (req, res) {
  try {
    const { fullName, email, phone, address} = req.body;

    if (!fullName || !email || !phone || !address) {
      return res.status(400).send("All fields are required");
    }

    // Create the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Load from .env
        pass: process.env.EMAIL_PASS, // Load from .env
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`, // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: fullName, // Subject line
      html: `
        <p><b>FullName:</b> ${fullName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Address:</b> ${address}</p>
      `, // Email body
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

app.listen(3000)