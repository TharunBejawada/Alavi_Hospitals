import { db, TABLE_NAME_INSURANCE_PROCESS } from "../db/dynamo.js";
import { PutCommand, ScanCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

// --- 1. CREATE ---
export const addInsuranceProcessInfo = async (req: any, res: any) => {
  try {
    const processId = uuidv4();
    const timestamp = new Date().toISOString();

    const newInfo = {
      processId,
      ...req.body,
      enabled: true,
      createdAt: timestamp
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_INSURANCE_PROCESS,
      Item: newInfo,
    }));

    res.status(201).json({ success: true, message: "Process info added successfully", info: newInfo });
  } catch (error) {
    console.error("Add Insurance Process Info Error:", error);
    res.status(500).json({ error: "Failed to add process info" });
  }
};

// --- 2. GET ALL (sorted by priorityOrder, lowest first) ---
export const getAllInsuranceProcessInfo = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({ TableName: TABLE_NAME_INSURANCE_PROCESS }));
    const items = result.Items || [];
    items.sort((a: any, b: any) => (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99));
    res.status(200).json({ Items: items });
  } catch (error) {
    console.error("Fetch Insurance Process Info Error:", error);
    res.status(500).json({ error: "Failed to fetch process info" });
  }
};

// --- 3. GET ALL ENABLED (sorted by priorityOrder, lowest first) ---
export const getAllEnabledInsuranceProcessInfo = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({
      TableName: TABLE_NAME_INSURANCE_PROCESS,
      FilterExpression: "#enabled = :enabledVal",
      ExpressionAttributeNames: { "#enabled": "enabled" },
      ExpressionAttributeValues: { ":enabledVal": true }
    }));
    const items = result.Items || [];
    items.sort((a: any, b: any) => (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99));
    res.status(200).json({ Items: items });
  } catch (error) {
    console.error("Fetch Enabled Insurance Process Info Error:", error);
    res.status(500).json({ error: "Failed to fetch enabled process info" });
  }
};

// --- 4. GET SINGLE BY ID ---
export const getInsuranceProcessInfoById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await db.send(new GetCommand({
      TableName: TABLE_NAME_INSURANCE_PROCESS,
      Key: { processId: id }
    }));

    if (!result.Item) return res.status(404).json({ error: "Process info not found" });
    res.status(200).json({ Item: result.Item });
  } catch (error) {
    console.error("Get Insurance Process Info By ID Error:", error);
    res.status(500).json({ error: "Failed to fetch process info" });
  }
};

// --- 5. UPDATE ---
export const updateInsuranceProcessInfo = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updatedInfo = {
      ...req.body,
      processId: id,
      updatedAt: new Date().toISOString()
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_INSURANCE_PROCESS,
      Item: updatedInfo
    }));

    res.status(200).json({ success: true, message: "Process info updated" });
  } catch (error) {
    console.error("Update Insurance Process Info Error:", error);
    res.status(500).json({ error: "Failed to update process info" });
  }
};

// --- 6. TOGGLE STATUS ---
export const toggleInsuranceProcessInfoStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;

    const existing = await db.send(new GetCommand({
      TableName: TABLE_NAME_INSURANCE_PROCESS,
      Key: { processId: id }
    }));

    if (!existing.Item) return res.status(404).json({ error: "Process info not found" });

    await db.send(new PutCommand({
      TableName: TABLE_NAME_INSURANCE_PROCESS,
      Item: { ...existing.Item, enabled }
    }));

    res.status(200).json({ success: true, message: "Process info status updated" });
  } catch (error) {
    console.error("Toggle Insurance Process Info Status Error:", error);
    res.status(500).json({ error: "Failed to toggle status" });
  }
};

// --- 7. DELETE ---
export const deleteInsuranceProcessInfo = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await db.send(new DeleteCommand({
      TableName: TABLE_NAME_INSURANCE_PROCESS,
      Key: { processId: id }
    }));
    res.status(200).json({ success: true, message: "Process info deleted" });
  } catch (error) {
    console.error("Delete Insurance Process Info Error:", error);
    res.status(500).json({ error: "Failed to delete process info" });
  }
};
