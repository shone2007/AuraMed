const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;

  // Use Ethereal if SMTP is not configured
  if (!process.env.SMTP_HOST) {
    console.log('No SMTP_HOST found. Using Ethereal test account...');

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
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  const message = {
    from: `${process.env.FROM_NAME || 'AuraMed'} <${
      process.env.FROM_EMAIL || process.env.SMTP_EMAIL
    }>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent:', info.messageId);

  if (!process.env.SMTP_HOST) {
    console.log(
      'Preview URL:',
      nodemailer.getTestMessageUrl(info)
    );
  }
};

module.exports = sendEmail;