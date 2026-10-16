import dotenv from "dotenv";
dotenv.config();

import { DynamoDBClient, ListTablesCommand, DescribeTableCommand, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
  }
});

const docClient = DynamoDBDocumentClient.from(client);

async function main() {
  console.log("Connecting to DynamoDB in region:", process.env.AWS_REGION);
  const tables = await client.send(new ListTablesCommand({}));
  console.log("Existing tables:", tables.TableNames);

  const tableName = "BioMedicalWaste";
  const exists = tables.TableNames?.includes(tableName);

  if (!exists) {
    console.log(`Creating table ${tableName}...`);
    try {
      await client.send(new CreateTableCommand({
        TableName: tableName,
        KeySchema: [
          { AttributeName: "id", KeyType: "HASH" }
        ],
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: "S" }
        ],
        BillingMode: "PAY_PER_REQUEST"
      }));
      console.log(`Table ${tableName} created successfully! Waiting for ACTIVE state...`);
      let isActive = false;
      while (!isActive) {
        await new Promise((res) => setTimeout(res, 2000));
        const desc = await client.send(new DescribeTableCommand({ TableName: tableName }));
        if (desc.Table?.TableStatus === "ACTIVE") {
          isActive = true;
          console.log(`Table ${tableName} is now ACTIVE.`);
        }
      }
    } catch (err: any) {
      console.error("Error creating table:", err.message);
    }
  } else {
    console.log(`Table ${tableName} already exists.`);
    const desc = await client.send(new DescribeTableCommand({ TableName: tableName }));
    console.log("Table KeySchema:", JSON.stringify(desc.Table?.KeySchema));
  }

  // Calculate dates for today, yesterday, and two days ago
  const now = new Date();
  // Adjust to IST (+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const getIstDateStr = (daysAgo: number) => {
    const d = new Date(now.getTime() + istOffset);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split("T")[0];
  };

  const today = getIstDateStr(0);
  const yesterday = getIstDateStr(1);
  const twoDaysAgo = getIstDateStr(2);

  const sampleRecords = [
    {
      id: `IDPL_${today}`,
      wasteId: `IDPL_${today}`,
      branch: "IDPL",
      date: today,
      ClinicalWaste: 14.5,
      InfectiousWaste: 18.2,
      SharpWaste: 3.1,
      BottleWaste: 6.4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: `Chintal_${today}`,
      wasteId: `Chintal_${today}`,
      branch: "Chintal",
      date: today,
      ClinicalWaste: 11.2,
      InfectiousWaste: 14.6,
      SharpWaste: 2.4,
      BottleWaste: 4.9,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: `IDPL_${yesterday}`,
      wasteId: `IDPL_${yesterday}`,
      branch: "IDPL",
      date: yesterday,
      ClinicalWaste: 12.8,
      InfectiousWaste: 16.9,
      SharpWaste: 2.75,
      BottleWaste: 5.8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: `Chintal_${yesterday}`,
      wasteId: `Chintal_${yesterday}`,
      branch: "Chintal",
      date: yesterday,
      ClinicalWaste: 10.5,
      InfectiousWaste: 13.8,
      SharpWaste: 2.1,
      BottleWaste: 4.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: `IDPL_${twoDaysAgo}`,
      wasteId: `IDPL_${twoDaysAgo}`,
      branch: "IDPL",
      date: twoDaysAgo,
      ClinicalWaste: 15.2,
      InfectiousWaste: 19.4,
      SharpWaste: 3.5,
      BottleWaste: 7.1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: `Chintal_${twoDaysAgo}`,
      wasteId: `Chintal_${twoDaysAgo}`,
      branch: "Chintal",
      date: twoDaysAgo,
      ClinicalWaste: 12.1,
      InfectiousWaste: 15.3,
      SharpWaste: 2.8,
      BottleWaste: 5.2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  console.log(`Inserting ${sampleRecords.length} records into DynamoDB table ${tableName}...`);
  for (const item of sampleRecords) {
    await docClient.send(new PutCommand({
      TableName: tableName,
      Item: item
    }));
    console.log(`Inserted: ${item.branch} - ${item.date} (${item.id})`);
  }

  // Scan and verify
  const result = await docClient.send(new ScanCommand({
    TableName: tableName
  }));
  console.log(`Verification: Table currently contains ${result.Items?.length || 0} records:`);
  result.Items?.forEach((r) => {
    console.log(` - [${r.branch}] ${r.date}: Clinical=${r.ClinicalWaste}kg, Infectious=${r.InfectiousWaste}kg, Sharp=${r.SharpWaste}kg, Bottle=${r.BottleWaste}kg`);
  });
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
