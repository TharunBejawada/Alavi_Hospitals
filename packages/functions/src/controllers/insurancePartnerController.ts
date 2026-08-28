import { db, TABLE_NAME_INSURANCE_PARTNERS, BUCKET_NAME, AWS_REGION } from "../db/dynamo.js";
import { PutCommand, ScanCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({ region: AWS_REGION });

// --- 1. CREATE ---
export const addInsurancePartner = async (req: any, res: any) => {
  try {
    const partnerId = uuidv4();
    const timestamp = new Date().toISOString();

    const newPartner = {
      partnerId,
      ...req.body,
      enabled: true,
      createdAt: timestamp
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_INSURANCE_PARTNERS,
      Item: newPartner,
    }));

    res.status(201).json({ success: true, message: "Insurance partner added successfully", partner: newPartner });
  } catch (error) {
    console.error("Add Insurance Partner Error:", error);
    res.status(500).json({ error: "Failed to add insurance partner" });
  }
};

// --- 2. GET ALL (optionally filtered by ?type=government|private, sorted by priorityOrder) ---
export const getAllInsurancePartners = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({ TableName: TABLE_NAME_INSURANCE_PARTNERS }));
    let items = result.Items || [];
    const { type } = req.query;
    if (type) items = items.filter((p: any) => p.type === type);
    items.sort((a: any, b: any) => (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99));
    res.status(200).json({ Items: items });
  } catch (error) {
    console.error("Fetch Insurance Partners Error:", error);
    res.status(500).json({ error: "Failed to fetch insurance partners" });
  }
};

// --- 3. GET ALL ENABLED (optionally filtered by ?type=, sorted by priorityOrder) ---
export const getAllEnabledInsurancePartners = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({
      TableName: TABLE_NAME_INSURANCE_PARTNERS,
      FilterExpression: "#enabled = :enabledVal",
      ExpressionAttributeNames: { "#enabled": "enabled" },
      ExpressionAttributeValues: { ":enabledVal": true }
    }));
    let items = result.Items || [];
    const { type } = req.query;
    if (type) items = items.filter((p: any) => p.type === type);
    items.sort((a: any, b: any) => (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99));
    res.status(200).json({ Items: items });
  } catch (error) {
    console.error("Fetch Enabled Insurance Partners Error:", error);
    res.status(500).json({ error: "Failed to fetch enabled insurance partners" });
  }
};

// --- 4. GET SINGLE BY ID ---
export const getInsurancePartnerById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await db.send(new GetCommand({
      TableName: TABLE_NAME_INSURANCE_PARTNERS,
      Key: { partnerId: id }
    }));

    if (!result.Item) return res.status(404).json({ error: "Insurance partner not found" });
    res.status(200).json({ Item: result.Item });
  } catch (error) {
    console.error("Get Insurance Partner By ID Error:", error);
    res.status(500).json({ error: "Failed to fetch insurance partner" });
  }
};

// --- 5. UPDATE ---
export const updateInsurancePartner = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updatedPartner = {
      ...req.body,
      partnerId: id,
      updatedAt: new Date().toISOString()
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_INSURANCE_PARTNERS,
      Item: updatedPartner
    }));

    res.status(200).json({ success: true, message: "Insurance partner updated" });
  } catch (error) {
    console.error("Update Insurance Partner Error:", error);
    res.status(500).json({ error: "Failed to update insurance partner" });
  }
};

// --- 6. TOGGLE STATUS ---
export const toggleInsurancePartnerStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;

    const existing = await db.send(new GetCommand({
      TableName: TABLE_NAME_INSURANCE_PARTNERS,
      Key: { partnerId: id }
    }));

    if (!existing.Item) return res.status(404).json({ error: "Insurance partner not found" });

    await db.send(new PutCommand({
      TableName: TABLE_NAME_INSURANCE_PARTNERS,
      Item: { ...existing.Item, enabled }
    }));

    res.status(200).json({ success: true, message: "Insurance partner status updated" });
  } catch (error) {
    console.error("Toggle Insurance Partner Status Error:", error);
    res.status(500).json({ error: "Failed to toggle status" });
  }
};

// --- 7. DELETE ---
export const deleteInsurancePartner = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await db.send(new DeleteCommand({
      TableName: TABLE_NAME_INSURANCE_PARTNERS,
      Key: { partnerId: id }
    }));
    res.status(200).json({ success: true, message: "Insurance partner deleted" });
  } catch (error) {
    console.error("Delete Insurance Partner Error:", error);
    res.status(500).json({ error: "Failed to delete insurance partner" });
  }
};

// --- 8. S3 LOGO UPLOAD ---
export const uploadInsurancePartnerImage = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const key = `insurance-partners/${uuidv4()}.${fileExtension}`;

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
