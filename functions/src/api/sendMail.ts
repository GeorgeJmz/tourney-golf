import admin = require("firebase-admin");

export const sendMail = async (
  email: string | string[],
  subject: string,
  body: string
) => {
  const db = admin.firestore();
  const mailCollection = await db.collection("mail");
  const newMail = mailCollection.doc();
  const emailContent = {
    to: email,
    message: {
      from: "TEEBOX League <teeboxleague@gmail.com>",
      subject: subject,
      text: body,
      html: `<p>${body}</p>`,
    },
  };
  await newMail.set(emailContent);
};
