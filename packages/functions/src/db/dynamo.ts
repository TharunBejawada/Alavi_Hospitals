import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Initialize the Client
// Ensure your local environment has AWS credentials configured (AWS_ACCESS_KEY_ID, etc.)
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1", // Change to your region (e.g., us-east-1)
});

// The DocumentClient simplifies working with JSON objects
export const db = DynamoDBDocumentClient.from(client);

export const TABLE_NAME = "Users";
export const TABLE_NAME_BLOGS = "Blogs";
export const TABLE_NAME_DOCTORS = "Doctors";
export const TABLE_NAME_AVAILABILITY = "DoctorAvailability";

// S3 Configuration
export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "alavi-hospitals-assets"; 
export const AWS_REGION = process.env.AWS_REGION || "ap-south-1";