import { db, TABLE_NAME_SECOND_OPINIONS, BUCKET_NAME, AWS_REGION } from "../db/dynamo.js";
import { PutCommand, ScanCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Initialize S3 Client
const s3 = new S3Client({ region: AWS_REGION });

// Strips an optional leading slash and an optional "second-opinion/" prefix
// so slugs saved as "/foo", "second-opinion/foo", or "foo" all match the
// same route param.
const normalizeUrlSlug = (url: string) => (url || "").replace(/^\/?(second-opinion\/)?/, "").replace(/\/$/, "");

// --- 1. CREATE ---
export const addSecondOpinion = async (req: any, res: any) => {
  try {
    const secondOpinionId = uuidv4();
    const timestamp = new Date().toISOString();

    const newTopic = {
      secondOpinionId,
      ...req.body,
      enabled: true,
      createdAt: timestamp
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_SECOND_OPINIONS,
      Item: newTopic,
    }));

    res.status(201).json({ success: true, message: "Second Opinion topic added successfully", topic: newTopic });
  } catch (error) {
    console.error("Add Second Opinion Error:", error);
    res.status(500).json({ error: "Failed to add second opinion topic" });
  }
};

// --- 2. GET ALL (sorted by priorityOrder, lowest first) ---
export const getAllSecondOpinions = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({ TableName: TABLE_NAME_SECOND_OPINIONS }));
    const items = result.Items || [];
    items.sort((a: any, b: any) => (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99));
    res.status(200).json({ Items: items });
  } catch (error) {
    console.error("Fetch Second Opinions Error:", error);
    res.status(500).json({ error: "Failed to fetch second opinion topics" });
  }
};

// --- 3. GET ALL ENABLED (sorted by priorityOrder, lowest first) ---
export const getAllEnabledSecondOpinions = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({
      TableName: TABLE_NAME_SECOND_OPINIONS,
      FilterExpression: "#enabled = :enabledVal",
      ExpressionAttributeNames: { "#enabled": "enabled" },
      ExpressionAttributeValues: { ":enabledVal": true }
    }));
    const items = result.Items || [];
    items.sort((a: any, b: any) => (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99));
    res.status(200).json({ Items: items });
  } catch (error) {
    console.error("Fetch Enabled Second Opinions Error:", error);
    res.status(500).json({ error: "Failed to fetch enabled second opinion topics" });
  }
};

// --- 4. GET SINGLE BY ID ---
export const getSecondOpinionById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await db.send(new GetCommand({
      TableName: TABLE_NAME_SECOND_OPINIONS,
      Key: { secondOpinionId: id }
    }));

    if (!result.Item) return res.status(404).json({ error: "Second Opinion topic not found" });
    res.status(200).json({ Item: result.Item });
  } catch (error) {
    console.error("Get Second Opinion By ID Error:", error);
    res.status(500).json({ error: "Failed to fetch second opinion topic" });
  }
};

// --- 5. GET SINGLE BY URL SLUG ---
export const getSecondOpinionByUrl = async (req: any, res: any) => {
  try {
    const { url } = req.params;
    const result = await db.send(new ScanCommand({ TableName: TABLE_NAME_SECOND_OPINIONS }));
    const items = result.Items || [];
    const normalizedUrl = normalizeUrlSlug(url);
    const match = items.find((t: any) => normalizeUrlSlug(t.seoConfig?.url) === normalizedUrl);

    if (!match) return res.status(404).json({ error: "Second Opinion topic not found" });
    res.status(200).json({ Item: match });
  } catch (error) {
    console.error("Get Second Opinion By URL Error:", error);
    res.status(500).json({ error: "Failed to fetch second opinion topic" });
  }
};

// --- 6. UPDATE ---
export const updateSecondOpinion = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updatedTopic = {
      ...req.body,
      secondOpinionId: id,
      updatedAt: new Date().toISOString()
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_SECOND_OPINIONS,
      Item: updatedTopic
    }));

    res.status(200).json({ success: true, message: "Second Opinion topic updated" });
  } catch (error) {
    console.error("Update Second Opinion Error:", error);
    res.status(500).json({ error: "Failed to update second opinion topic" });
  }
};

// --- 7. TOGGLE STATUS ---
export const toggleSecondOpinionStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;

    const existing = await db.send(new GetCommand({
      TableName: TABLE_NAME_SECOND_OPINIONS,
      Key: { secondOpinionId: id }
    }));

    if (!existing.Item) return res.status(404).json({ error: "Second Opinion topic not found" });

    await db.send(new PutCommand({
      TableName: TABLE_NAME_SECOND_OPINIONS,
      Item: { ...existing.Item, enabled }
    }));

    res.status(200).json({ success: true, message: "Second Opinion status updated" });
  } catch (error) {
    console.error("Toggle Second Opinion Status Error:", error);
    res.status(500).json({ error: "Failed to toggle status" });
  }
};

// --- 8. DELETE ---
export const deleteSecondOpinion = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await db.send(new DeleteCommand({
      TableName: TABLE_NAME_SECOND_OPINIONS,
      Key: { secondOpinionId: id }
    }));
    res.status(200).json({ success: true, message: "Second Opinion topic deleted" });
  } catch (error) {
    console.error("Delete Second Opinion Error:", error);
    res.status(500).json({ error: "Failed to delete second opinion topic" });
  }
};

// --- 9. S3 IMAGE UPLOAD (banner/overview images) ---
export const uploadSecondOpinionImage = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const key = `second-opinions/${uuidv4()}.${fileExtension}`;

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

// --- 10. S3 FILE UPLOAD (patient-submitted medical reports on the public form) ---
export const uploadSecondOpinionReport = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const key = `second-opinion-reports/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);
    const fileUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    res.status(200).json({ success: true, fileUrl });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};
