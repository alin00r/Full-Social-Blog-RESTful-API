const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = class Email {
  constructor(user, resetCode) {
    this.to = user.email;
    this.Name = user.name;
    this.resetCode = resetCode;
    this.from = `Blog App<${process.env.GMAIL_USERNAME}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      Name: this.Name,
      resetCode: this.resetCode,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to My Blog App!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 20 minutes)',
    );
  }
  async sendPasswordchanged() {
    await this.send('passwordChanged', 'Your password has been changed.');
  }
};
