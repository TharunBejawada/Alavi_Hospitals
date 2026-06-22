import { db, TABLE_NAME_SPECIALITY_PAGES } from "../db/dynamo.js";
import { PutCommand, ScanCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

export const addSpecialityPage = async (req: any, res: any) => {
  try {
    const pageId = uuidv4();
    const newPage = {
      pageId,
      ...req.body,
      enabled: true,
      createdAt: new Date().toISOString()
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_SPECIALITY_PAGES,
      Item: newPage,
    }));

    res.status(201).json({ success: true, pageId });
  } catch (error) {
    console.error("Add Page Error:", error);
    res.status(500).json({ error: "Failed to add speciality page" });
  }
};

export const getAllSpecialityPages = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({ TableName: TABLE_NAME_SPECIALITY_PAGES }));
    res.status(200).json({ Items: result.Items || [] });
  } catch (error) {
    console.error("Fetch Pages Error:", error);
    res.status(500).json({ error: "Failed to fetch speciality pages" });
  }
};

export const getSpecialityPageById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await db.send(new GetCommand({
      TableName: TABLE_NAME_SPECIALITY_PAGES,
      Key: { pageId: id }
    }));

    if (!result.Item) return res.status(404).json({ error: "Page not found" });
    res.status(200).json({ Item: result.Item });
  } catch (error) {
    console.error("Get Page Error:", error);
    res.status(500).json({ error: "Failed to fetch page" });
  }
};

export const updateSpecialityPage = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updatedPage = { ...req.body, pageId: id };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_SPECIALITY_PAGES,
      Item: updatedPage
    }));

    res.status(200).json({ success: true, message: "Page updated" });
  } catch (error) {
    console.error("Update Page Error:", error);
    res.status(500).json({ error: "Failed to update page" });
  }
};

export const deleteSpecialityPage = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await db.send(new DeleteCommand({
      TableName: TABLE_NAME_SPECIALITY_PAGES,
      Key: { pageId: id }
    }));
    res.status(200).json({ success: true, message: "Page deleted" });
  } catch (error) {
    console.error("Delete Page Error:", error);
    res.status(500).json({ error: "Failed to delete page" });
  }
};