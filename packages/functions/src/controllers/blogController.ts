import { db, TABLE_NAME_BLOGS, BUCKET_NAME, AWS_REGION } from "../db/dynamo.js";
import { PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Initialize S3 Client
const s3 = new S3Client({ region: AWS_REGION });

// --- 1. CREATE BLOG ---
export const addBlog = async (req: any, res: any) => {
  try {
    const blogId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Parse extraFields if they come as stringified JSON (common with FormData)
    let extraFields = req.body.extraFields;
    if (typeof extraFields === 'string') {
      try { extraFields = JSON.parse(extraFields); } catch (e) {}
    }

    const newBlog = {
      blogId,
      ...req.body,
      extraFields: extraFields || [],
      enabled: true,
      createdAt: timestamp
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_BLOGS,
      Item: newBlog,
    }));

    res.status(201).json({ success: true, message: "Blog added successfully", blog: newBlog });
  } catch (error) {
    console.error("Add Blog Error:", error);
    res.status(500).json({ error: "Failed to add blog" });
  }
};

// --- 2. GET ALL BLOGS ---
export const getAllBlogs = async (req: any, res: any) => {
  try {
    const result = await db.send(new ScanCommand({ TableName: TABLE_NAME_BLOGS }));
    res.status(200).json({ Items: result.Items || [] });
  } catch (error) {
    console.error("Fetch Blogs Error:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

// --- 3. GET SINGLE BLOG ---
export const getBlogById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await db.send(new GetCommand({
      TableName: TABLE_NAME_BLOGS,
      Key: { blogId: id }
    }));

    if (!result.Item) return res.status(404).json({ error: "Blog not found" });
    res.status(200).json({ Item: result.Item });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};

export const getBlogByURL = async (req: any, res: any) => {
  try {
    const { url } = req.params; 

    const result = await db.send(new ScanCommand({
      TableName: TABLE_NAME_BLOGS,
      FilterExpression: "#url = :urlVal",
      ExpressionAttributeNames: {
        "#url": "url" 
      },
      ExpressionAttributeValues: {
        ":urlVal": url
      }
    }));

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ Item: result.Items[0] });
  } catch (error) {
    console.error("Error fetching blog by URL:", error);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};

// --- 4. UPDATE BLOG ---
export const updateBlog = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Parse extraFields if stringified
    let extraFields = req.body.extraFields;
    if (typeof extraFields === 'string') {
      try { extraFields = JSON.parse(extraFields); } catch (e) {}
    }

    const updatedBlog = {
      ...req.body,
      extraFields: extraFields || [],
      blogId: id, 
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_BLOGS,
      Item: updatedBlog
    }));

    res.status(200).json({ success: true, message: "Blog updated" });
  } catch (error) {
    console.error("Update Blog Error:", error);
    res.status(500).json({ error: "Failed to update blog" });
  }
};

// --- 5. TOGGLE STATUS ---
export const toggleBlogStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;

    await db.send(new UpdateCommand({
      TableName: TABLE_NAME_BLOGS,
      Key: { blogId: id },
      UpdateExpression: "set enabled = :e",
      ExpressionAttributeValues: { ":e": enabled }
    }));

    res.status(200).json({ success: true, message: "Status updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle status" });
  }
};

// --- 6. REAL S3 IMAGE UPLOAD ---
export const uploadBlogImage = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const key = `blogs/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // Note: If your bucket blocks public ACLs (recommended), 
      // you must rely on a Bucket Policy to allow public read access to /blogs/*
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