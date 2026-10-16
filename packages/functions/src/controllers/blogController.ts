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

// Helper to derive target blog categories corresponding to a given department/speciality name
function getSpecialityCategories(deptName: string): string[] {
  const s = ' ' + (deptName || '').toLowerCase().replace(/[^a-z0-9&]/g, ' ') + ' ';
  const cats: string[] = [];

  if (s.includes('orthop')) cats.push('orthopaedics', 'orthopedics', 'orthopedic');
  if (s.includes('gyn') || s.includes('obstet')) cats.push('gynaecology', 'gynecology', 'obstetrics');
  if (s.includes('general medicine') || s.includes('diabet')) cats.push('general medicine', 'diabetology', 'diabetes');
  if (s.includes('general') && (s.includes('surgery') || s.includes('laparoscopic'))) {
    cats.push('general surgery', 'general & laparoscopic surgery', 'general & laparoscopic', 'laparoscopic surgery');
  }
  if (s.includes('pediatric') || s.includes('paediatric') || s.includes('neonat')) {
    cats.push('pediatric', 'pediatrics', 'paediatric', 'paediatrics');
  }
  if (s.includes('pulmon') || s.includes('chest')) cats.push('pulmonology', 'chest');
  if (s.includes('neurosurg')) cats.push('neurosurgery');
  else if (s.includes('neurolog') && !s.includes('psychiatry')) cats.push('neurology');
  
  if (s.includes('psychiatry')) cats.push('neuropsychiatry', 'psychiatry');
  if (s.includes('cardio') || s.includes('cardiac')) cats.push('cardiology', 'cardiac');
  if (/\b(urology|andrology)\b/.test(s)) cats.push('urology', 'andrology');
  if (s.includes('nephrolog') || s.includes('renal')) cats.push('nephrology');
  if (/\bdental\b/.test(s)) cats.push('dental');
  if (/\bent\b/.test(s)) cats.push('ent');
  if (s.includes('gastro')) cats.push('gastroenterology', 'gastro');
  if (s.includes('oncol') || s.includes('cancer')) cats.push('oncology');
  if (s.includes('physio') || s.includes('rehab')) cats.push('physiotherapy');
  if (s.includes('rheumatol') || s.includes('functional medicine')) cats.push('rheumatology', 'functional medicine');

  const rawClean = (deptName || '').toLowerCase().trim();
  if (rawClean && !cats.includes(rawClean)) cats.push(rawClean);

  return cats;
}

export function matchBlogCategoriesWithDepartment(blogCategories: any, departmentName: string): boolean {
  if (!blogCategories || !departmentName) return false;

  let categories: string[] = [];

  if (typeof blogCategories === "string") {
    try {
      const parsed = JSON.parse(blogCategories);
      if (Array.isArray(parsed)) {
        categories = parsed.map(c => String(c.S || c));
      } else {
        categories = [blogCategories];
      }
    } catch {
      categories = [blogCategories];
    }
  } else if (Array.isArray(blogCategories)) {
    categories = blogCategories.map(c => String(c.S || c));
  } else if (typeof blogCategories === "object" && blogCategories !== null) {
    if (blogCategories.S) {
      categories = [String(blogCategories.S)];
    }
  }

  if (categories.length === 0) return false;

  const targetCats = getSpecialityCategories(departmentName);
  const normalizedCats = categories.map(c => c.toLowerCase().trim());

  return normalizedCats.some(c => targetCats.includes(c));
}

// --- 7. GET RELATED BLOGS BY DEPARTMENT KEYWORDS / CATEGORIES ---
export const getBlogsByDepartmentKeywords = async (req: any, res: any) => {
  try {
    const department = decodeURIComponent(req.params.department || "");

    if (!department.trim()) {
      return res.status(200).json({ Items: [] });
    }

    const result = await db.send(new ScanCommand({
      TableName: TABLE_NAME_BLOGS,
      FilterExpression: "#enabled = :enabledVal",
      ExpressionAttributeNames: { "#enabled": "enabled" },
      ExpressionAttributeValues: { ":enabledVal": true }
    }));

    const allBlogs = result.Items || [];

    const matchedBlogs = allBlogs.filter(blog => {
      return matchBlogCategoriesWithDepartment(blog.categories, department);
    });

    matchedBlogs.sort((a, b) => new Date(b.createdAt || b.timeline || 0).getTime() - new Date(a.createdAt || a.timeline || 0).getTime());

    res.status(200).json({ Items: matchedBlogs });
  } catch (error) {
    console.error("Error fetching related blogs by category:", error);
    res.status(500).json({ error: "Failed to fetch related blogs" });
  }
};