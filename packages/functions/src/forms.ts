import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

const dynamoDb = new DynamoDB.DocumentClient();

export const submit: APIGatewayProxyHandler = async (event) => {
  try {
    const data = JSON.parse(event.body || "{}");
    const { name, mobile, email, message, page } = data;

    // 1. Validation
    if (!name || !mobile) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name and Mobile Number are required." }),
      };
    }

    const id = uuidv4();
    const timestamp = new Date().toISOString();
    const sourcePage = page || "Unknown Page";

    // 2. Save to DynamoDB
    await dynamoDb.put({
      TableName: "FORMS",
      Item: {
        formId: id,
        name,
        mobile,
        email: email || "N/A",
        message: message || "N/A",
        page: sourcePage,
        createdAt: timestamp,
      },
    }).promise();

    // 3. Send Email Notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "alavihospitalsdm@gmail.com",
      subject: `New Inquiry from Website - ${sourcePage}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #A62B2B;">New Patient Inquiry</h2>
          <p><strong>Source:</strong> ${sourcePage}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${mobile}</p>
          <p><strong>Email:</strong> ${email || "N/A"}</p>
          <p><strong>Message:</strong><br/>${message || "No message provided."}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">Received at: ${new Date(timestamp).toLocaleString('en-IN')}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Form submitted successfully" }),
    };

  } catch (error) {
    console.error("Form Submission Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};