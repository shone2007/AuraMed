const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;

  // If no SMTP settings are configured in .env, use a fake Ethereal account
  if (!process.env.SMTP_HOST) {
    console.log('No SMTP_HOST found in .env. Generating a test Ethereal account...');

    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    // Gmail SMTP
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Setup email data
  const message = {
    from: `${process.env.FROM_NAME || 'AuraMed'} <${process.env.FROM_EMAIL || 'noreply@auramed.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send email
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);

  // If using Ethereal, print preview URL
  if (!process.env.SMTP_HOST) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

module.exports = sendEmail;