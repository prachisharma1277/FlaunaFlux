// src/utils/mailer.js
const nodemailer = require('nodemailer');

// 1. Configure your Nodemailer transporter
// It reads the email credentials from your .env file
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends a dynamic email alert.
 * @param {object} alert - The alert object from your database.
 */
async function sendAlertEmail(alert) {
  // 2. Create dynamic subject and text from the alert object
  const subject = `New FaunaFlux Alert: ${alert.type} - ${alert.species}`;
  
  const textBody = `
    A new alert has been triggered by a user.
    
    Alert Details:
    - Type: ${alert.type}
    - Species: ${alert.species}
    - Location: ${alert.location.coordinates.join(', ')}
    - Description: ${alert.description}
    - Severity: ${alert.severity}
    
    Please log in to the dashboard to review this incident.
  `;

  try {
    const info = await transporter.sendMail({
      from: '"FaunaFlux Alerts" <prachi@mail.vinucode.in>', // Your "from" address
      to: ["prachi141btcse23@igdtuw.ac.in","prachisharmaa1277@gmail.com"] ,// Your recipient list
      subject: subject,
      text: textBody,
    });

    console.log("Email alert sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email alert:", error);
  }
}

// 3. Export the function

module.exports = { sendAlertEmail };
