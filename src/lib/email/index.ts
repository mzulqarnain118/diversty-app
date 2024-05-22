import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
  // host: process.env.SMTP_HOST,
  // port: parseInt(process.env.SMTP_PORT || "") || 465,
  // secure: true,
  // auth: {
  //   type: "OAuth2",
  //   user: process.env.SMTP_USER, // Your email address
  //   serviceClient: process.env.SMTP_CLIENT_ID,
  //   privateKey: process.env.SMTP_PRIVATE_KEY,
  //   accessUrl: process.env.SMTP_TOKEN_URI,
  // },

  service: 'gmail',
  auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
  }
});

// Function to read a file asynchronously and return its contents as a string
const readFileAsync = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

export const sendRecoveryEmail = async (
  to: string,
  username: string,
  link: string
): Promise<void> => {
  try {
    // src\lib\email\templates\recoverPassword\recoverPassword.html
    const templateHTML = await readFileAsync(
      path.resolve(
        "./src/lib/email/templates/recoverPassword/recoverPassword.html"
      )
    );
    const templateText = await readFileAsync(
      path.resolve(
        "./src/lib/email/templates/recoverPassword/recoverPassword.txt"
      )
    );

    // Replace placeholders in the template with actual values
    const html = templateHTML
      .replace("{username}", username)
      .replace("{verificationLink}", link);
    const text = templateText
      .replace("{username}", username)
      .replace("{verificationLink}", link);

    await transporter.verify();
    // Send the email
    await transporter.sendMail({
      // from: "your_email@example.com",
      to,
      subject: "Password Recovery",
      text,
      html,
    });

    console.log("Verification email sent successfully");
  } catch (e) {
    console.log(e);
  }
};

export const sendVerificationEmail = async (
  to: string,
  username: string,
  verificationLink: string
): Promise<void> => {
  try {
    const templateHTML = await readFileAsync(
      path.resolve("./src/lib/email/templates/signup/signup.html")
    );
    const templateText = await readFileAsync(
      path.resolve("./src/lib/email/templates/signup/signup.txt")
    );

    // Replace placeholders in the template with actual values
    const html = templateHTML
      .replace("{username}", username)
      .replace("{verificationLink}", verificationLink);
    const text = templateText
      .replace("{username}", username)
      .replace("{verificationLink}", verificationLink);

    await transporter.verify();
    // Send the email
    await transporter.sendMail({
      // from: "your_email@example.com",
      to,
      subject: "Email Verification",
      text,
      html,
    });

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};


export const sendSurveyInvitationEmal = async (to:string, surveyLink:string, company: string)=>{
  try {
    const templateHTML = await readFileAsync(
      path.resolve("./src/lib/email/templates/surveyInvitation/invitation.html")
    );
    const templateText = await readFileAsync(
      path.resolve("./src/lib/email/templates/surveyInvitation/invitation.txt")
    );
    const templateSubject = await readFileAsync(
      path.resolve("./src/lib/email/templates/surveyInvitation/invitation-subject.txt")
    );

    // Replace placeholders in the template with actual values
    const html = templateHTML
      .replace("{verificationLink}", surveyLink);
    const text = templateText
      .replace("{verificationLink}", surveyLink);
    const subject = templateSubject.replace("{companyName}", company)

    await transporter.verify();
    // Send the email
    await transporter.sendMail({
      // from: "your_email@example.com",
      to,
      subject,
      text,
      html,
    });

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error
  }
}
