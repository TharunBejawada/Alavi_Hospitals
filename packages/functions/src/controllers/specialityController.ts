import { db, TABLE_NAME_SPECIALITIES, BUCKET_NAME, AWS_REGION } from "../db/dynamo.js";
import { PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Initialize S3 Client
const s3 = new S3Client({ region: AWS_REGION });

// --- 1. CREATE SPECIALITY ---
export const addSpeciality = async (req: any, res: any) => {
  try {
    const specialityId = uuidv4();
    const timestamp = new Date().toISOString();

    const newSpeciality = {
      specialityId,
      ...req.body,
      enabled: true,
      createdAt: timestamp
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_SPECIALITIES,
      Item: newSpeciality,
    }));

    res.status(201).json({ success: true, message: "Speciality added successfully", speciality: newSpeciality });
  } catch (error) {
    console.error("Add Speciality Error:", error);
    res.status(500).json({ error: "Failed to add speciality" });
  }
};

// --- 2. GET ALL SPECIALITIES ---
export const getAllSpecialities = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({ TableName: TABLE_NAME_SPECIALITIES }));
    
    // Sort by priorityOrder (lowest number first), defaulting to 99 if missing
    let specialities = result.Items || [];
    specialities.sort((a, b) => (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99));

    res.status(200).json({ Items: specialities });
  } catch (error) {
    console.error("Fetch Specialities Error:", error);
    res.status(500).json({ error: "Failed to fetch specialities" });
  }
};

// --- 3. GET SINGLE SPECIALITY BY ID ---
export const getSpecialityById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await db.send(new GetCommand({
      TableName: TABLE_NAME_SPECIALITIES,
      Key: { specialityId: id }
    }));

    if (!result.Item) return res.status(404).json({ error: "Speciality not found" });
    res.status(200).json({ Item: result.Item });
  } catch (error) {
    console.error("Get Speciality By ID Error:", error);
    res.status(500).json({ error: "Failed to fetch speciality" });
  }
};

// --- 4. UPDATE SPECIALITY ---
export const updateSpeciality = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const updatedSpeciality = {
      ...req.body,
      specialityId: id, 
    };

    // Using PutCommand entirely replaces the item, keeping logic consistent
    await db.send(new PutCommand({
      TableName: TABLE_NAME_SPECIALITIES,
      Item: updatedSpeciality
    }));

    res.status(200).json({ success: true, message: "Speciality updated" });
  } catch (error) {
    console.error("Update Speciality Error:", error);
    res.status(500).json({ error: "Failed to update speciality" });
  }
};

// --- 5. TOGGLE SPECIALITY STATUS ---
export const toggleSpecialityStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;

    await db.send(new UpdateCommand({
      TableName: TABLE_NAME_SPECIALITIES,
      Key: { specialityId: id },
      UpdateExpression: "set enabled = :e",
      ExpressionAttributeValues: { ":e": enabled }
    }));

    res.status(200).json({ success: true, message: "Speciality status updated" });
  } catch (error) {
    console.error("Toggle Speciality Status Error:", error);
    res.status(500).json({ error: "Failed to toggle status" });
  }
};

// --- 6. DELETE SPECIALITY ---
export const deleteSpeciality = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await db.send(new DeleteCommand({
      TableName: TABLE_NAME_SPECIALITIES,
      Key: { specialityId: id }
    }));
    res.status(200).json({ success: true, message: "Speciality deleted" });
  } catch (error) {
    console.error("Delete Speciality Error:", error);
    res.status(500).json({ error: "Failed to delete speciality" });
  }
};

// --- 7. S3 IMAGE UPLOAD ---
export const uploadSpecialityImage = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const key = `specialities/${uuidv4()}.${fileExtension}`; 

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);
    const imageUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    res.status(200).json({ success: true, imageUrl: imageUrl });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

// --- 8. GET ALL ENABLED SPECIALITIES ---
export const getAllEnabledSpecialities = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({ 
      TableName: TABLE_NAME_SPECIALITIES,
      FilterExpression: "#enabled = :enabledVal",
      ExpressionAttributeNames: { "#enabled": "enabled" },
      ExpressionAttributeValues: { ":enabledVal": true }
    }));
    
    let specialities = result.Items || [];
    specialities.sort((a, b) => (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99));

    res.status(200).json({ Items: specialities });
  } catch (error) {
    console.error("Fetch Enabled Specialities Error:", error);
    res.status(500).json({ error: "Failed to fetch enabled specialities" });
  }
};