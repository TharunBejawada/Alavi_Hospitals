import { db, TABLE_NAME_TREATMENTS, BUCKET_NAME, AWS_REGION } from "../db/dynamo.js";
import { PutCommand, ScanCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Initialize S3 Client
const s3 = new S3Client({ region: AWS_REGION });

// Strips an optional leading slash and an optional "treatments/" prefix so
// slugs saved as "/foo", "treatments/foo", or "foo" all match the same route param.
const normalizeUrlSlug = (url: string) => (url || "").replace(/^\/?(treatments\/)?/, "").replace(/\/$/, "");

// All (itemType, itemId) pairs a Treatment record covers: its primary
// mapping plus any additionalItems.
const getMappedPairs = (t: any): { itemType: string; itemId: string }[] => [
  { itemType: t.itemType, itemId: t.itemId },
  ...((t.additionalItems || []) as any[]).map((a) => ({ itemType: a.itemType, itemId: a.itemId }))
];

// Given a candidate set of (itemType, itemId) pairs for a speciality, returns
// the subset already claimed (as primary or additional) by some other
// Treatment in that speciality, optionally excluding a given treatmentId
// (used by update to allow a record to keep its own existing mappings).
const findMappingConflicts = async (
  specialityId: string,
  candidates: { itemType: string; itemId: string }[],
  excludeTreatmentId?: string
) => {
  const result = await db.send(new ScanCommand({
    TableName: TABLE_NAME_TREATMENTS,
    FilterExpression: "specialityId = :sid",
    ExpressionAttributeValues: { ":sid": specialityId }
  }));

  const others = (result.Items || []).filter((t: any) => t.treatmentId !== excludeTreatmentId);
  const taken = new Set<string>();
  others.forEach((t: any) => getMappedPairs(t).forEach(({ itemType, itemId }) => taken.add(`${itemType}:${itemId}`)));

  return candidates.filter(({ itemType, itemId }) => taken.has(`${itemType}:${itemId}`));
};

// --- 1. CREATE TREATMENT ---
export const addTreatment = async (req: any, res: any) => {
  try {
    const { specialityId, itemType, itemId, additionalItems } = req.body;
    const candidates = [{ itemType, itemId }, ...((additionalItems || []) as any[]).map((a) => ({ itemType: a.itemType, itemId: a.itemId }))];

    const conflicts = await findMappingConflicts(specialityId, candidates);
    if (conflicts.length > 0) {
      return res.status(409).json({ error: "One or more selected items already have a treatment page.", conflicts });
    }

    const treatmentId = uuidv4();
    const timestamp = new Date().toISOString();

    const newTreatment = {
      treatmentId,
      ...req.body,
      enabled: true,
      createdAt: timestamp
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_TREATMENTS,
      Item: newTreatment,
    }));

    res.status(201).json({ success: true, message: "Treatment added successfully", treatment: newTreatment });
  } catch (error) {
    console.error("Add Treatment Error:", error);
    res.status(500).json({ error: "Failed to add treatment" });
  }
};

// --- 2. GET ALL TREATMENTS ---
export const getAllTreatments = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({ TableName: TABLE_NAME_TREATMENTS }));
    res.status(200).json({ Items: result.Items || [] });
  } catch (error) {
    console.error("Fetch Treatments Error:", error);
    res.status(500).json({ error: "Failed to fetch treatments" });
  }
};

// --- 3. GET TREATMENTS BY SPECIALITY ---
export const getTreatmentsBySpeciality = async (req: any, res: any) => {
  try {
    const { specialityId } = req.params;
    const result = await db.send(new ScanCommand({
      TableName: TABLE_NAME_TREATMENTS,
      FilterExpression: "specialityId = :sid",
      ExpressionAttributeValues: { ":sid": specialityId }
    }));
    res.status(200).json({ Items: result.Items || [] });
  } catch (error) {
    console.error("Fetch Treatments By Speciality Error:", error);
    res.status(500).json({ error: "Failed to fetch treatments for speciality" });
  }
};

// --- 4. GET SINGLE TREATMENT BY ID ---
export const getTreatmentById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await db.send(new GetCommand({
      TableName: TABLE_NAME_TREATMENTS,
      Key: { treatmentId: id }
    }));

    if (!result.Item) return res.status(404).json({ error: "Treatment not found" });
    res.status(200).json({ Item: result.Item });
  } catch (error) {
    console.error("Get Treatment By ID Error:", error);
    res.status(500).json({ error: "Failed to fetch treatment" });
  }
};

// --- 5. GET SINGLE TREATMENT BY URL SLUG ---
export const getTreatmentByUrl = async (req: any, res: any) => {
  try {
    const { url } = req.params;
    const result = await db.send(new ScanCommand({ TableName: TABLE_NAME_TREATMENTS }));
    const items = result.Items || [];
    const normalizedUrl = normalizeUrlSlug(url);
    const match = items.find((t: any) => normalizeUrlSlug(t.seoConfig?.url) === normalizedUrl);

    if (!match) return res.status(404).json({ error: "Treatment not found" });
    res.status(200).json({ Item: match });
  } catch (error) {
    console.error("Get Treatment By URL Error:", error);
    res.status(500).json({ error: "Failed to fetch treatment" });
  }
};

// --- 6. UPDATE TREATMENT ---
export const updateTreatment = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { specialityId, itemType, itemId, additionalItems } = req.body;
    const candidates = [{ itemType, itemId }, ...((additionalItems || []) as any[]).map((a) => ({ itemType: a.itemType, itemId: a.itemId }))];

    const conflicts = await findMappingConflicts(specialityId, candidates, id);
    if (conflicts.length > 0) {
      return res.status(409).json({ error: "One or more selected items already have a treatment page.", conflicts });
    }

    const updatedTreatment = {
      ...req.body,
      treatmentId: id,
      updatedAt: new Date().toISOString()
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_TREATMENTS,
      Item: updatedTreatment
    }));

    res.status(200).json({ success: true, message: "Treatment updated" });
  } catch (error) {
    console.error("Update Treatment Error:", error);
    res.status(500).json({ error: "Failed to update treatment" });
  }
};

// --- 7. TOGGLE TREATMENT STATUS ---
export const toggleTreatmentStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;

    const existing = await db.send(new GetCommand({
      TableName: TABLE_NAME_TREATMENTS,
      Key: { treatmentId: id }
    }));

    if (!existing.Item) return res.status(404).json({ error: "Treatment not found" });

    await db.send(new PutCommand({
      TableName: TABLE_NAME_TREATMENTS,
      Item: { ...existing.Item, enabled }
    }));

    res.status(200).json({ success: true, message: "Treatment status updated" });
  } catch (error) {
    console.error("Toggle Treatment Status Error:", error);
    res.status(500).json({ error: "Failed to toggle status" });
  }
};

// --- 8. DELETE TREATMENT ---
export const deleteTreatment = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await db.send(new DeleteCommand({
      TableName: TABLE_NAME_TREATMENTS,
      Key: { treatmentId: id }
    }));
    res.status(200).json({ success: true, message: "Treatment deleted" });
  } catch (error) {
    console.error("Delete Treatment Error:", error);
    res.status(500).json({ error: "Failed to delete treatment" });
  }
};

// --- 9. S3 IMAGE UPLOAD ---
export const uploadTreatmentImage = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const key = `treatments/${uuidv4()}.${fileExtension}`;

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
