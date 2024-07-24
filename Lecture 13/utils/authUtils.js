const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const isEmailValidate = ({ key }) => {
  const isEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      key
    );
  return isEmail;
};

const userDataValidation = ({ name, email, username, password }) => {
  return new Promise((resolve, reject) => {
    if (!email || !username || !password) reject("Missing user data");

    if (typeof email !== "string") reject("Email is not a text");
    if (typeof username !== "string") reject("username is not a text");
    if (typeof password !== "string") reject("password is not a text");

    if (username.length < 3 || username.length > 50)
      reject("Username length should be 3-50");

    if (!isEmailValidate({ key: email }))
      reject("Format of an email is incorrect");
    resolve();
  });
};

const genrateToken = (email) => {
  const token = jwt.sign(email, process.env.SECRET_KEY);
  return token;
};

const sendVerificationMail = (email, token) => {
  //transpoter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: "kssinghkaran13@gmail.com",
      pass: "",
    },
  });

  const mailOptions = {
    from: "kssinghkaran13@gmail.com",
    to: email,
    subject: "Email verification for todo app",
    html: `<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Todo App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  
    <style type="text/css">
      a[x-apple-data-detectors] {color: inherit !important;}
    </style>
  
  </head>
  <body style="margin: 0; padding: 0;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding: 20px 0 30px 0;">
  
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc;">
    <tr>
      <td align="center" bgcolor="#defcf9" style="padding: 40px 0 30px 0;">
        <img src="https://www.jotform.com/blog/wp-content/uploads/2020/01/email-marketing-intro-02-700x544.png" alt="logo" width="300" height="230" style="display: block;" />
      </td>
    </tr>
    <tr>
      <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
          <tr>
            <td style="color: #00adb5; font-family: Arial, sans-serif;">
              <h3 style="font-size: 24px; margin: 0; margin-bottom:6px; text-align:center; font-family: Montserrat, sans-serif;">Hey</h3>
              <h3 style="font-size: 24px; margin: 0; text-align:center; "color: #00adb5;  font-family: Montserrat, sans-serif;">Activate your Email</h3>
            </td>
          </tr>
          <tr>
            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding: 20px 0 30px 0;">
            <a href="http://localhost:8000/verify/${token}" style=" border: none;
            background-color: #ef7e5c;
    color: white;
    padding: 15px 32px;
    text-align: center;
  
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 175px;
    cursor: pointer;
    border-radius:5px;">Activate Account</a>
            </td>
  
        </table>
      </td>
    </tr>
    <tr>
      <td bgcolor="#ef7e5c" style="padding: 30px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
          <tr>
            <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
              <p style="margin: 0;">&reg; Someone, somewhere 2021<br/>
             <a href="" style="color: #ffffff;">Subscribe</a> to us!</p>
            </td>
            </tr>
        </table>
      </td>
    </tr>
    </table>
  
        </td>
      </tr>
    </table>
  </body>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email has been sent successfully:${email} ` + info.response);
    }
  });
};

module.exports = {
  userDataValidation,
  isEmailValidate,
  genrateToken,
  sendVerificationMail,
};
