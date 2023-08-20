import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'login',
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

function sendMail(email: string, link?: string) {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'File Upload Notification',
    html: `
    <div>Your file has been successfully uploaded. ${
      link && `you can download <a href="${link}">this</a>`
    } </div>
    <div style="color: red;">This file will expire in 7 days</div>
    `,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}
export default sendMail;
