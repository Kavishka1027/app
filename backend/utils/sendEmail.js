// utils/sendEmail.js
const nodemailer = require('nodemailer');

// Create a function to send emails
const sendEmail = async (to, subject, text) => {
    // Create a transporter for sending email
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // You can use any other email service provider (e.g., Outlook, Yahoo, etc.)
        auth: {
            user: process.env.EMAIL_USER,  // Your Gmail address (from .env file)
            pass: process.env.EMAIL_PASS   // Your Gmail app password (from .env file)
        }
    });

    // Define the email options
    const mailOptions = {
        from: process.env.EMAIL_USER,   // Sender's email address
        to: to,                        // Recipient's email address
        subject: subject,              // Email subject
        text: text                     // Email body text
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;
