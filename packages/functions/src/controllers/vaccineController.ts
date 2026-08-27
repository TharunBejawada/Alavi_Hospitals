import { db, TABLE_NAME_VACCINES } from "../db/dynamo.js";
import { PutCommand, ScanCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

// --- 1. CREATE ---
export const addVaccine = async (req: any, res: any) => {
  try {
    const vaccineId = uuidv4();
    const timestamp = new Date().toISOString();

    const newVaccine = {
      vaccineId,
      ...req.body,
      enabled: true,
      createdAt: timestamp
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_VACCINES,
      Item: newVaccine,
    }));

    res.status(201).json({ success: true, message: "Vaccine added successfully", vaccine: newVaccine });
  } catch (error) {
    console.error("Add Vaccine Error:", error);
    res.status(500).json({ error: "Failed to add vaccine" });
  }
};

// --- 2. GET ALL (sorted by priorityOrder, lowest first) ---
export const getAllVaccines = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({ TableName: TABLE_NAME_VACCINES }));
    const items = result.Items || [];
    items.sort((a: any, b: any) => (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99));
    res.status(200).json({ Items: items });
  } catch (error) {
    console.error("Fetch Vaccines Error:", error);
    res.status(500).json({ error: "Failed to fetch vaccines" });
  }
};

// --- 3. GET ALL ENABLED (sorted by priorityOrder, lowest first) ---
export const getAllEnabledVaccines = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({
      TableName: TABLE_NAME_VACCINES,
      FilterExpression: "#enabled = :enabledVal",
      ExpressionAttributeNames: { "#enabled": "enabled" },
      ExpressionAttributeValues: { ":enabledVal": true }
    }));
    const items = result.Items || [];
    items.sort((a: any, b: any) => (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99));
    res.status(200).json({ Items: items });
  } catch (error) {
    console.error("Fetch Enabled Vaccines Error:", error);
    res.status(500).json({ error: "Failed to fetch enabled vaccines" });
  }
};

// --- 4. GET SINGLE BY ID ---
export const getVaccineById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await db.send(new GetCommand({
      TableName: TABLE_NAME_VACCINES,
      Key: { vaccineId: id }
    }));

    if (!result.Item) return res.status(404).json({ error: "Vaccine not found" });
    res.status(200).json({ Item: result.Item });
  } catch (error) {
    console.error("Get Vaccine By ID Error:", error);
    res.status(500).json({ error: "Failed to fetch vaccine" });
  }
};

// --- 5. UPDATE ---
export const updateVaccine = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updatedVaccine = {
      ...req.body,
      vaccineId: id,
      updatedAt: new Date().toISOString()
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_VACCINES,
      Item: updatedVaccine
    }));

    res.status(200).json({ success: true, message: "Vaccine updated" });
  } catch (error) {
    console.error("Update Vaccine Error:", error);
    res.status(500).json({ error: "Failed to update vaccine" });
  }
};

// --- 6. TOGGLE STATUS ---
export const toggleVaccineStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;

    const existing = await db.send(new GetCommand({
      TableName: TABLE_NAME_VACCINES,
      Key: { vaccineId: id }
    }));

    if (!existing.Item) return res.status(404).json({ error: "Vaccine not found" });

    await db.send(new PutCommand({
      TableName: TABLE_NAME_VACCINES,
      Item: { ...existing.Item, enabled }
    }));

    res.status(200).json({ success: true, message: "Vaccine status updated" });
  } catch (error) {
    console.error("Toggle Vaccine Status Error:", error);
    res.status(500).json({ error: "Failed to toggle status" });
  }
};

// --- 7. DELETE ---
export const deleteVaccine = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await db.send(new DeleteCommand({
      TableName: TABLE_NAME_VACCINES,
      Key: { vaccineId: id }
    }));
    res.status(200).json({ success: true, message: "Vaccine deleted" });
  } catch (error) {
    console.error("Delete Vaccine Error:", error);
    res.status(500).json({ error: "Failed to delete vaccine" });
  }
};
