import { db, TABLE_NAME } from "../db/dynamo.ts";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { User } from "@alavi-hospitals-app/core/src/types.ts"; // Shared types
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export const createUser = async (req: any, res: any) => {
  try {
    const { name, email, role } = req.body;

    // 1. Validation
    if (!name || !email || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2. Check if user already exists (Using the EmailIndex GSI)
    const checkUserParams = {
      TableName: TABLE_NAME,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };
    
    const existingUser = await db.send(new QueryCommand(checkUserParams));

    if (existingUser.Items && existingUser.Items.length > 0) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // 3. Generate Temporary Password & Hash It
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // 4. Create User Object
    const userId = uuidv4();
    const timestamp = new Date().toISOString();

    const newUserItem = {
      userId,           // Partition Key
      email,            // GSI Key
      name,
      role,
      status: "ACTIVE",
      password: hashedPassword, // Storing HASH only
      lastLogin: null,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // 5. Save to DynamoDB
    await db.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: newUserItem,
    }));

    // 6. Return Response (Exclude password hash, Include temp password)
    const { password, ...userSafeData } = newUserItem;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userSafeData,
      tempPassword: tempPassword // Admin sees this ONCE
    });

  } catch (error) {
    console.error("DynamoDB Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllUsers = async (req: any, res: any) => {
  try {
    // Fetches all items from the table
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      // Ideally use "ProjectionExpression" to exclude 'password' from the response
      ProjectionExpression: "userId, email, #n, #r, #s, lastLogin",
      ExpressionAttributeNames: { 
         "#n": "name",
         "#r": "role",
         "#s": "status"
      }
    });

    const result = await db.send(command);

    // Map DynamoDB items to cleaner Frontend friendly format if needed
    const users = result.Items?.map(item => ({
      id: item.userId,
      name: item.name,
      email: item.email,
      role: item.role,
      status: item.status,
      lastLogin: item.lastLogin
    }));

    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};