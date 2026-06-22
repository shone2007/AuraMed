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
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  } else {
    // Create reusable transporter object using the configured SMTP transport
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
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

  // If we used a fake account, print the URL where the user can view the email
  if (!process.env.SMTP_HOST) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

module.exports = sendEmail;
