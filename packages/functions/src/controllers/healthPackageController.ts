import { db, TABLE_NAME_HEALTH_PACKAGES, BUCKET_NAME, AWS_REGION } from "../db/dynamo.js";
import { PutCommand, ScanCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({ region: AWS_REGION });

// Strips an optional leading slash and an optional "health-packages/" prefix
// so slugs saved as "/foo", "health-packages/foo", or "foo" all match the
// same route param.
const normalizeUrlSlug = (url: string) => (url || "").replace(/^\/?(health-packages\/)?/, "").replace(/\/$/, "");

// --- 1. CREATE ---
export const addHealthPackage = async (req: any, res: any) => {
  try {
    const healthPackageId = uuidv4();
    const timestamp = new Date().toISOString();

    const newPackage = {
      healthPackageId,
      ...req.body,
      enabled: true,
      createdAt: timestamp
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_HEALTH_PACKAGES,
      Item: newPackage,
    }));

    res.status(201).json({ success: true, message: "Health package added successfully", package: newPackage });
  } catch (error) {
    console.error("Add Health Package Error:", error);
    res.status(500).json({ error: "Failed to add health package" });
  }
};

// --- 2. GET ALL (sorted by priorityOrder, lowest first) ---
export const getAllHealthPackages = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({ TableName: TABLE_NAME_HEALTH_PACKAGES }));
    const items = result.Items || [];
    items.sort((a: any, b: any) => (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99));
    res.status(200).json({ Items: items });
  } catch (error) {
    console.error("Fetch Health Packages Error:", error);
    res.status(500).json({ error: "Failed to fetch health packages" });
  }
};

// --- 3. GET ALL ENABLED (sorted by priorityOrder, lowest first) ---
export const getAllEnabledHealthPackages = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({
      TableName: TABLE_NAME_HEALTH_PACKAGES,
      FilterExpression: "#enabled = :enabledVal",
      ExpressionAttributeNames: { "#enabled": "enabled" },
      ExpressionAttributeValues: { ":enabledVal": true }
    }));
    const items = result.Items || [];
    items.sort((a: any, b: any) => (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99));
    res.status(200).json({ Items: items });
  } catch (error) {
    console.error("Fetch Enabled Health Packages Error:", error);
    res.status(500).json({ error: "Failed to fetch enabled health packages" });
  }
};

// --- 4. GET SINGLE BY ID ---
export const getHealthPackageById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await db.send(new GetCommand({
      TableName: TABLE_NAME_HEALTH_PACKAGES,
      Key: { healthPackageId: id }
    }));

    if (!result.Item) return res.status(404).json({ error: "Health package not found" });
    res.status(200).json({ Item: result.Item });
  } catch (error) {
    console.error("Get Health Package By ID Error:", error);
    res.status(500).json({ error: "Failed to fetch health package" });
  }
};

// --- 5. GET SINGLE BY URL SLUG ---
export const getHealthPackageByUrl = async (req: any, res: any) => {
  try {
    const { url } = req.params;
    const result = await db.send(new ScanCommand({ TableName: TABLE_NAME_HEALTH_PACKAGES }));
    const items = result.Items || [];
    const normalizedUrl = normalizeUrlSlug(url);
    const match = items.find((p: any) => normalizeUrlSlug(p.seoConfig?.url) === normalizedUrl);

    if (!match) return res.status(404).json({ error: "Health package not found" });
    res.status(200).json({ Item: match });
  } catch (error) {
    console.error("Get Health Package By URL Error:", error);
    res.status(500).json({ error: "Failed to fetch health package" });
  }
};

// --- 6. UPDATE ---
export const updateHealthPackage = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updatedPackage = {
      ...req.body,
      healthPackageId: id,
      updatedAt: new Date().toISOString()
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_HEALTH_PACKAGES,
      Item: updatedPackage
    }));

    res.status(200).json({ success: true, message: "Health package updated" });
  } catch (error) {
    console.error("Update Health Package Error:", error);
    res.status(500).json({ error: "Failed to update health package" });
  }
};

// --- 7. TOGGLE STATUS ---
export const toggleHealthPackageStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;

    const existing = await db.send(new GetCommand({
      TableName: TABLE_NAME_HEALTH_PACKAGES,
      Key: { healthPackageId: id }
    }));

    if (!existing.Item) return res.status(404).json({ error: "Health package not found" });

    await db.send(new PutCommand({
      TableName: TABLE_NAME_HEALTH_PACKAGES,
      Item: { ...existing.Item, enabled }
    }));

    res.status(200).json({ success: true, message: "Health package status updated" });
  } catch (error) {
    console.error("Toggle Health Package Status Error:", error);
    res.status(500).json({ error: "Failed to toggle status" });
  }
};

// --- 8. DELETE ---
export const deleteHealthPackage = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await db.send(new DeleteCommand({
      TableName: TABLE_NAME_HEALTH_PACKAGES,
      Key: { healthPackageId: id }
    }));
    res.status(200).json({ success: true, message: "Health package deleted" });
  } catch (error) {
    console.error("Delete Health Package Error:", error);
    res.status(500).json({ error: "Failed to delete health package" });
  }
};

// --- 9. S3 IMAGE UPLOAD (card/hero/test-group images, assessment icons) ---
export const uploadHealthPackageImage = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const key = `health-packages/${uuidv4()}.${fileExtension}`;

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
