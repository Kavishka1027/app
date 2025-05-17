const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "ashan.hexdive@gmail.com",
      pass: "gjeu fpkh vlub zmoc"
    }
  });

  await transporter.sendMail({
    from: "ashan.hexdive@gmail.com",
    to,
    subject,
    html
  });
};

module.exports = sendEmail;
