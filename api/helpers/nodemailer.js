
const nodemailer = require("nodemailer");
module.exports = {
  friendlyName: "Nodemailer",
  description: "Nodemailer something.",
  inputs: {
    email: {
      type: "string",
    },
    name: {
      type: "string",
    },
  },
  exits: {
    success: {
      description: "All done.",
    },
  },
  fn: async function (subject, message) {
    let transporter = await nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "7c194f25cc0d13",
        pass: "f32bf5576d71a8",
      },
    });

    const users = await User.find();
    // console.log(users);

    for (const user of users) {
      const subject = "E-Library";
      const message = "New Book Added To Your E-Library"
      const mailOptions = {
        from: "your-email@example.com", // Sender email address
        to: user.email, // Recipient email address
        subject:subject, // Subject of the email
        text: message, // Plain text version of the email (can be HTML if you prefer)
      };
      // console.log("message sent : %s", info.messageId);
      await transporter.sendMail(mailOptions);
    }
  },
};
