
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
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "29f018184185d9",
        pass: "********b45e"
      }
    });
    const users = await User.find();
    // console.log(users);

    for (const user of users) {
      const subject = "E-Library";
      const message = "New Book Added To Your E-Library"
      const mailOptions = {
        from: "admin@krupali.com", 
        to: user.email, 
        subject:subject, 
        text: message, 
      };
      
      await transporter.sendMail(mailOptions);
    }
  },
};
