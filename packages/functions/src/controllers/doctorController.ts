import { db, TABLE_NAME_DOCTORS, BUCKET_NAME, AWS_REGION } from "../db/dynamo.js";
import { PutCommand, ScanCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Initialize S3 Client
const s3 = new S3Client({ region: AWS_REGION });

// --- 1. CREATE DOCTOR ---
export const addDoctor = async (req: any, res: any) => {
  try {
    const doctorId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Parse extraFields and faqs if they come as stringified JSON (common with FormData)
    let extraFields = req.body.extraFields;
    if (typeof extraFields === 'string') {
      try { extraFields = JSON.parse(extraFields); } catch (e) {}
    }

    let faqs = req.body.faqs;
    if (typeof faqs === 'string') {
      try { faqs = JSON.parse(faqs); } catch (e) {}
    }

    const newDoctor = {
      doctorId,
      ...req.body,
      extraFields: extraFields || [],
      faqs: faqs || [],
      enabled: true,
      createdAt: timestamp
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_DOCTORS,
      Item: newDoctor,
    }));

    res.status(201).json({ success: true, message: "Doctor added successfully", doctor: newDoctor });
  } catch (error) {
    console.error("Add Doctor Error:", error);
    res.status(500).json({ error: "Failed to add doctor" });
  }
};

// --- 2. GET ALL DOCTORS ---
export const getAllDoctors = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({ TableName: TABLE_NAME_DOCTORS }));
    
    // Sort by priorityOrder (lowest number first), defaulting to 99 if missing
    let doctors = result.Items || [];
    doctors.sort((a, b) => (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99));

    res.status(200).json({ Items: doctors });
  } catch (error) {
    console.error("Fetch Doctors Error:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

// --- 3. GET SINGLE DOCTOR BY ID ---
export const getDoctorById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await db.send(new GetCommand({
      TableName: TABLE_NAME_DOCTORS,
      Key: { doctorId: id }
    }));

    if (!result.Item) return res.status(404).json({ error: "Doctor not found" });
    res.status(200).json({ Item: result.Item });
  } catch (error) {
    console.error("Get Doctor By ID Error:", error);
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
};

// --- 4. GET DOCTOR BY URL (Optional, but matches blog logic) ---
export const getDoctorByURL = async (req: any, res: any) => {
  try {
    const { url } = req.params; 

    const result = await db.send(new ScanCommand({
      TableName: TABLE_NAME_DOCTORS,
      FilterExpression: "#url = :urlVal",
      ExpressionAttributeNames: {
        "#url": "url" 
      },
      ExpressionAttributeValues: {
        ":urlVal": url
      }
    }));

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.status(200).json({ Item: result.Items[0] });
  } catch (error) {
    console.error("Error fetching doctor by URL:", error);
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
};

// --- 5. UPDATE DOCTOR ---
export const updateDoctor = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Parse extraFields and faqs if stringified
    let extraFields = req.body.extraFields;
    if (typeof extraFields === 'string') {
      try { extraFields = JSON.parse(extraFields); } catch (e) {}
    }

    let faqs = req.body.faqs;
    if (typeof faqs === 'string') {
      try { faqs = JSON.parse(faqs); } catch (e) {}
    }

    const updatedDoctor = {
      ...req.body,
      extraFields: extraFields || [],
      faqs: faqs || [],
      doctorId: id, 
    };

    // Using PutCommand entirely replaces the item, keeping logic consistent with Blog
    await db.send(new PutCommand({
      TableName: TABLE_NAME_DOCTORS,
      Item: updatedDoctor
    }));

    res.status(200).json({ success: true, message: "Doctor updated" });
  } catch (error) {
    console.error("Update Doctor Error:", error);
    res.status(500).json({ error: "Failed to update doctor" });
  }
};

// --- 6. TOGGLE DOCTOR STATUS ---
export const toggleDoctorStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;

    await db.send(new UpdateCommand({
      TableName: TABLE_NAME_DOCTORS,
      Key: { doctorId: id },
      UpdateExpression: "set enabled = :e",
      ExpressionAttributeValues: { ":e": enabled }
    }));

    res.status(200).json({ success: true, message: "Doctor status updated" });
  } catch (error) {
    console.error("Toggle Doctor Status Error:", error);
    res.status(500).json({ error: "Failed to toggle status" });
  }
};

// --- 7. S3 IMAGE UPLOAD ---
export const uploadDoctorImage = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const key = `doctors/${uuidv4()}.${fileExtension}`; // Saving in a "doctors" folder

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    // Construct the Public URL
    const imageUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    res.status(200).json({ 
      success: true,
      imageUrl: imageUrl 
    });

  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

// --- 8. GET ALL ENABLED DOCTORS (For Frontend User App) ---
export const getAllEnabledDoctors = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({ 
      TableName: TABLE_NAME_DOCTORS,
      FilterExpression: "#enabled = :enabledVal",
      ExpressionAttributeNames: {
        "#enabled": "enabled"
      },
      ExpressionAttributeValues: {
        ":enabledVal": true
      }
    }));
    
    // Sort by priorityOrder (lowest number first), defaulting to 99 if missing
    let doctors = result.Items || [];
    doctors.sort((a, b) => (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99));

    res.status(200).json({ Items: doctors });
  } catch (error) {
    console.error("Fetch Enabled Doctors Error:", error);
    res.status(500).json({ error: "Failed to fetch enabled doctors" });
  }
};