import { db, TABLE_NAME_BIOMEDICAL_WASTE } from "../db/dynamo.js";
import {
  PutCommand,
  QueryCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand
} from "@aws-sdk/lib-dynamodb";

export const SUPPORTED_BRANCHES = [
  { id: "IDPL", name: "IDPL Branch", address: "IDPL Colony, Balanagar, Hyderabad" },
  { id: "Chintal", name: "Chintal Branch", address: "Jeedimetla Main Road, Chintal, Hyderabad" }
];

/**
 * Returns today's date in YYYY-MM-DD format (IST / UTC safe)
 */
function getTodayString(): string {
  const now = new Date();
  // Adjust to IST (+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  return istDate.toISOString().split("T")[0];
}

/**
 * Returns a past date formatted as YYYY-MM-DD
 */
export function getPastDate(daysAgo: number): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  istDate.setDate(istDate.getDate() - daysAgo);
  return istDate.toISOString().split("T")[0];
}

/**
 * Returns realistic sample records for recent days across branches
 */


/**
 * Validate YYYY-MM-DD date format and ensure it is not in the future.
 */
function validateDate(dateStr: string): { valid: boolean; error?: string } {
  if (!dateStr || typeof dateStr !== "string") {
    return { valid: false, error: "Date is required and must be a string." };
  }
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr.trim())) {
    return { valid: false, error: "Date must be formatted as YYYY-MM-DD." };
  }

  const parsed = new Date(dateStr.trim() + "T00:00:00Z");
  if (isNaN(parsed.getTime())) {
    return { valid: false, error: "Invalid calendar date provided." };
  }

  const todayStr = getTodayString();
  if (dateStr.trim() > todayStr) {
    return { valid: false, error: `Date cannot be in the future. Maximum allowed date is ${todayStr}.` };
  }

  return { valid: true };
}

/**
 * Validate non-negative numbers for waste fields.
 */
function parseWasteNumber(value: any, fieldName: string): { valid: boolean; value: number; error?: string } {
  if (value === undefined || value === null || value === "") {
    return { valid: true, value: 0 };
  }
  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, value: 0, error: `${fieldName} must be a valid number.` };
  }
  if (num < 0) {
    return { valid: false, value: 0, error: `${fieldName} cannot be negative.` };
  }
  return { valid: true, value: Number(num.toFixed(3)) };
}

/**
 * Helper to find existing record by branch and date
 */
async function findExistingRecord(branch: string, date: string): Promise<any | null> {
  const keyId = `${branch}_${date}`;

  // Try direct GetCommand by id
  try {
    const getRes = await db.send(new GetCommand({
      TableName: TABLE_NAME_BIOMEDICAL_WASTE,
      Key: { id: keyId }
    }));
    if (getRes.Item) return getRes.Item;
  } catch (err) {
    // If table has composite PK (branch + date)
    try {
      const getRes2 = await db.send(new GetCommand({
        TableName: TABLE_NAME_BIOMEDICAL_WASTE,
        Key: { branch, date }
      }));
      if (getRes2.Item) return getRes2.Item;
    } catch (_) {}
  }

  // Fallback: Scan with FilterExpression
  try {
    const scanRes = await db.send(new ScanCommand({
      TableName: TABLE_NAME_BIOMEDICAL_WASTE,
      FilterExpression: "#b = :branch AND #d = :date",
      ExpressionAttributeNames: { "#b": "branch", "#d": "date" },
      ExpressionAttributeValues: { ":branch": branch, ":date": date }
    }));
    if (scanRes.Items && scanRes.Items.length > 0) {
      return scanRes.Items[0];
    }
  } catch (scanErr) {
    console.warn("Scan check failed:", scanErr);
  }

  return null;
}

// --- 1. CREATE / UPSERT WASTE RECORD ---
export const upsertWasteRecord = async (req: any, res: any) => {
  try {
    const {
      branch,
      date,
      ClinicalWaste,
      InfectiousWaste,
      SharpWaste,
      BottleWaste,
      userRole,
      userBranch
    } = req.body;

    // 1. Branch Validation
    if (!branch || typeof branch !== "string" || !branch.trim()) {
      return res.status(400).json({ error: "Branch is required." });
    }
    const cleanBranch = branch.trim();

    // Role check if staff branch is provided
    if (userRole && userRole !== "ADMIN" && userRole !== "SUPERADMIN" && userRole !== "CORPORATE_ADMIN") {
      if (userBranch && userBranch.trim() !== cleanBranch) {
        return res.status(403).json({
          error: `Permission denied. Your user account is locked to the '${userBranch}' branch.`
        });
      }
    }

    // 2. Date Validation
    const dateValidation = validateDate(date);
    if (!dateValidation.valid) {
      return res.status(400).json({ error: dateValidation.error });
    }
    const cleanDate = date.trim();

    // 3. Numeric Waste Values Validation
    const clinicalCheck = parseWasteNumber(ClinicalWaste, "Clinical Waste");
    if (!clinicalCheck.valid) return res.status(400).json({ error: clinicalCheck.error });

    const infectiousCheck = parseWasteNumber(InfectiousWaste, "Infectious Waste");
    if (!infectiousCheck.valid) return res.status(400).json({ error: infectiousCheck.error });

    const sharpCheck = parseWasteNumber(SharpWaste, "Sharp Waste");
    if (!sharpCheck.valid) return res.status(400).json({ error: sharpCheck.error });

    const bottleCheck = parseWasteNumber(BottleWaste, "Bottle Waste");
    if (!bottleCheck.valid) return res.status(400).json({ error: bottleCheck.error });

    // 4. Check for existing record to support composite uniqueness upsert
    const existing = await findExistingRecord(cleanBranch, cleanDate);
    const nowIso = new Date().toISOString();
    const isUpdate = !!existing;

    const wasteId = `${cleanBranch}_${cleanDate}`;
    const payload = {
      id: wasteId,
      wasteId: wasteId,
      branch: cleanBranch,
      date: cleanDate,
      ClinicalWaste: clinicalCheck.value,
      InfectiousWaste: infectiousCheck.value,
      SharpWaste: sharpCheck.value,
      BottleWaste: bottleCheck.value,
      createdAt: existing?.createdAt || nowIso,
      updatedAt: nowIso
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_BIOMEDICAL_WASTE,
      Item: payload
    }));

    res.status(isUpdate ? 200 : 201).json({
      success: true,
      message: isUpdate
        ? `Waste record for ${cleanBranch} on ${cleanDate} updated successfully.`
        : `Waste record for ${cleanBranch} on ${cleanDate} created successfully.`,
      isUpdate,
      data: payload
    });

  } catch (error) {
    console.error("Upsert Bio Medical Waste Error:", error);
    res.status(500).json({ error: "Failed to save biomedical waste record." });
  }
};

// --- 2. GET WASTE RECORD BY DATE ---
export const getWasteRecordByDate = async (req: any, res: any) => {
  try {
    const { branch, date } = req.query;

    if (!branch || !date) {
      return res.status(400).json({ error: "Both branch and date query parameters are required." });
    }

    const record = await findExistingRecord(String(branch).trim(), String(date).trim());

    if (!record) {
      return res.status(200).json({ success: true, record: null });
    }

    res.status(200).json({ success: true, record });
  } catch (error) {
    console.error("Get Waste Record by Date Error:", error);
    res.status(500).json({ error: "Failed to retrieve biomedical waste record." });
  }
};

// --- 3. GET WASTE RECORDS BY PERIOD (YEAR & OPTIONAL MONTH) ---
export const getWasteRecordsByPeriod = async (req: any, res: any) => {
  try {
    const { branch, year, month } = req.query;

    // Scan table directly from DynamoDB
    const scanRes = await db.send(new ScanCommand({
      TableName: TABLE_NAME_BIOMEDICAL_WASTE
    }));
    let items = (scanRes.Items || []) as any[];

    // 1. Filter by branch (if provided and not 'ALL')
    if (branch && String(branch).toUpperCase() !== "ALL") {
      const cleanBranch = String(branch).trim().toLowerCase();
      items = items.filter(item => (item.branch || "").trim().toLowerCase() === cleanBranch);
    }

    // 2. Filter by Year & Month
    if (year) {
      const yearStr = String(year).trim();
      let prefix = yearStr;
      if (month) {
        const monthNum = String(month).padStart(2, "0");
        prefix = `${yearStr}-${monthNum}`;
      }
      items = items.filter(item => (item.date || "").startsWith(prefix));
    }

    // 3. Sort by date descending
    items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error("Get Waste Records by Period Error:", error);
    res.status(500).json({ error: "Failed to retrieve biomedical waste records." });
  }
};

// --- 4. UPDATE RECORD BY ID (INLINE EDITING SUPPORT) ---
export const updateWasteRecordById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const {
      branch,
      date,
      ClinicalWaste,
      InfectiousWaste,
      SharpWaste,
      BottleWaste,
      userRole,
      userBranch
    } = req.body;

    if (!branch || !date) {
      return res.status(400).json({ error: "Branch and date are required." });
    }

    if (userRole && userRole !== "ADMIN" && userRole !== "SUPERADMIN" && userRole !== "CORPORATE_ADMIN") {
      if (userBranch && userBranch.trim() !== branch.trim()) {
        return res.status(403).json({
          error: `Permission denied. Your user account is locked to the '${userBranch}' branch.`
        });
      }
    }

    const clinicalCheck = parseWasteNumber(ClinicalWaste, "Clinical Waste");
    if (!clinicalCheck.valid) return res.status(400).json({ error: clinicalCheck.error });

    const infectiousCheck = parseWasteNumber(InfectiousWaste, "Infectious Waste");
    if (!infectiousCheck.valid) return res.status(400).json({ error: infectiousCheck.error });

    const sharpCheck = parseWasteNumber(SharpWaste, "Sharp Waste");
    if (!sharpCheck.valid) return res.status(400).json({ error: sharpCheck.error });

    const bottleCheck = parseWasteNumber(BottleWaste, "Bottle Waste");
    if (!bottleCheck.valid) return res.status(400).json({ error: bottleCheck.error });

    const existing = await findExistingRecord(branch.trim(), date.trim());
    const nowIso = new Date().toISOString();
    const recordId = id || `${branch.trim()}_${date.trim()}`;

    const payload = {
      id: recordId,
      wasteId: recordId,
      branch: branch.trim(),
      date: date.trim(),
      ClinicalWaste: clinicalCheck.value,
      InfectiousWaste: infectiousCheck.value,
      SharpWaste: sharpCheck.value,
      BottleWaste: bottleCheck.value,
      createdAt: existing?.createdAt || nowIso,
      updatedAt: nowIso
    };

    await db.send(new PutCommand({
      TableName: TABLE_NAME_BIOMEDICAL_WASTE,
      Item: payload
    }));

    res.status(200).json({
      success: true,
      message: "Waste record updated successfully.",
      data: payload
    });
  } catch (error) {
    console.error("Update Waste Record Error:", error);
    res.status(500).json({ error: "Failed to update biomedical waste record." });
  }
};

// --- 5. DELETE RECORD BY ID ---
export const deleteWasteRecordById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Record ID is required." });
    }

    // Extract branch and date if id format is branch_date
    const parts = id.split("_");
    const branch = parts[0];
    const date = parts.slice(1).join("_");

    try {
      await db.send(new DeleteCommand({
        TableName: TABLE_NAME_BIOMEDICAL_WASTE,
        Key: { id }
      }));
    } catch (_) {
      if (branch && date) {
        await db.send(new DeleteCommand({
          TableName: TABLE_NAME_BIOMEDICAL_WASTE,
          Key: { branch, date }
        }));
      }
    }

    res.status(200).json({ success: true, message: "Record deleted successfully." });
  } catch (error) {
    console.error("Delete Waste Record Error:", error);
    res.status(500).json({ error: "Failed to delete biomedical waste record." });
  }
};

// --- 6. GET BRANCHES ---
export const getBranches = async (_req: any, res: any) => {
  res.status(200).json({
    success: true,
    branches: SUPPORTED_BRANCHES
  });
};
