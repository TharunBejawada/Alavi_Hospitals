import { APIGatewayProxyHandler } from "aws-lambda";
import { db, TABLE_NAME_FORM } from "./db/dynamo.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

export const submit: APIGatewayProxyHandler = async (event) => {
  try {
    const data = JSON.parse(event.body || "{}");
    
    // Destructure ALL possible fields from both Appointment and Contact forms
    const { name, mobile, email, speciality, doctor, date, reason, message, page } = data;

    // 1. BASE VALIDATION: Name and Mobile are mandatory for EVERY form
    if (!name || !mobile) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name and Mobile Number are required." }),
      };
    }

    // 2. CONTEXTUAL VALIDATION: If it's an appointment, demand specific fields
    const isAppointment = page === "Appointment Popup Window" || speciality || date;
    if (isAppointment && (!speciality || !date)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Department and Preferred Date are required for appointments." }),
      };
    }

    const id = uuidv4();
    const timestamp = new Date().toISOString();
    const sourcePage = page || "Unknown Page";

    // 3. DYNAMIC DATABASE ITEM: Only insert fields that actually have data
    const dbItem: any = {
      formId: id,
      name,
      mobile,
      page: sourcePage,
      createdAt: timestamp,
    };
    
    // Safely append optional fields so we don't save undefined or empty data
    if (email) dbItem.email = email;
    if (speciality) dbItem.speciality = speciality;
    if (doctor) dbItem.doctor = doctor;
    if (date) dbItem.preferredDate = date;
    if (reason) dbItem.reason = reason;
    if (message) dbItem.message = message;

    // 4. Save to DynamoDB
    await db.send(new PutCommand({
      TableName: TABLE_NAME_FORM,
      Item: dbItem,
    }));

    // 5. DYNAMIC HTML EMAIL: Build the email based on what was submitted
    let emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #663399;">${isAppointment ? 'New Appointment Request' : 'New Website Inquiry'}</h2>
        <p><strong>Source:</strong> ${sourcePage}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Mobile Number:</strong> ${mobile}</p>
        <p><strong>Email Address:</strong> ${email || "Not provided"}</p>
    `;

    if (isAppointment) {
      emailHtml += `
        <p><strong>Department/Specialty:</strong> ${speciality}</p>
        <p><strong>Preferred Doctor:</strong> ${doctor || "Any Available Doctor"}</p>
        <p><strong>Preferred Date:</strong> ${date}</p>
        <p><strong>Reason for Visit:</strong><br/>${reason || "Not provided."}</p>
      `;
    }

    if (message) {
      emailHtml += `<p><strong>Message:</strong><br/>${message}</p>`;
    }

    emailHtml += `
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">Received at: ${new Date(timestamp).toLocaleString('en-IN')}</p>
      </div>
    `;

    // 6. Send the Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: "hospitalsalavi@gmail.com",
      cc: "alavihospitals01@gmail.com",
      subject: `${isAppointment ? 'Appointment Request' : 'Website Inquiry'} - ${name}`,
      html: emailHtml,
    });

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