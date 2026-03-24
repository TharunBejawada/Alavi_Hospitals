import { db, TABLE_NAME } from "../db/dynamo.js";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 1. Find User by Email
    const params = {
      TableName: TABLE_NAME,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email },
    };

    const result = await db.send(new QueryCommand(params));
    const user = result.Items?.[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2. Compare Password (Hash)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({ error: "Account is inactive. Contact Administrator." });
    }

    // 3. Update Last Login Timestamp
    await db.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId },
      UpdateExpression: "set lastLogin = :now",
      ExpressionAttributeValues: { ":now": new Date().toISOString() }
    }));

    // 4. Success Response (Never return the password!)
    // In a real production app, you would generate a JWT token here.
    const { password: _, ...userSafe } = user;
    
    res.status(200).json({
      success: true,
      user: userSafe
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};