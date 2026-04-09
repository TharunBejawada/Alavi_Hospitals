import { db, TABLE_NAME_AVAILABILITY } from "../db/dynamo.js";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

// --- 1. SET AVAILABILITY ---
export const setDoctorAvailability = async (req: any, res: any) => {
  try {
    const { doctorID, location, date, available, startTime, endTime, interval } = req.body;

    if (!doctorID || !location || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a unique ID for this specific day and location
    const availabilityId = `${doctorID}_${date}_${location.replace(/\s+/g, '')}`;

    const payload = {
      availabilityId,
      doctorID,
      location,
      date,
      available,
      ...(available && { startTime, endTime, interval }),
      updatedAt: new Date().toISOString()
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_AVAILABILITY,
      Item: payload
    }));

    res.status(200).json({ success: true, message: "Availability saved", data: payload });
  } catch (error) {
    console.error("Set Availability Error:", error);
    res.status(500).json({ error: "Failed to save availability" });
  }
};

// --- 2. GET DOCTOR AVAILABILITY ---
export const getDoctorAvailability = async (req: any, res: any) => {
  try {
    const { doctorId } = req.params;

    // Use Scan with Filter (or Query if you set up a GSI for doctorID)
    const result = await db.send(new ScanCommand({
      TableName: TABLE_NAME_AVAILABILITY,
      FilterExpression: "#docId = :docId",
      ExpressionAttributeNames: {
        "#docId": "doctorID"
      },
      ExpressionAttributeValues: {
        ":docId": doctorId
      }
    }));

    res.status(200).json(result.Items || []);
  } catch (error) {
    console.error("Get Availability Error:", error);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
};