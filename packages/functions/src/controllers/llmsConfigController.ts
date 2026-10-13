import {
    db,
    TABLE_NAME_LLMS_CONFIG,
    TABLE_NAME_DOCTORS,
    TABLE_NAME_BLOGS,
    TABLE_NAME_SPECIALITY_PAGES,
    TABLE_NAME_SPECIALITIES,
    TABLE_NAME_TREATMENTS,
    TABLE_NAME_HEALTH_PACKAGES,
    TABLE_NAME_SECOND_OPINIONS
} from "../db/dynamo.js";
import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const BASE_URL = "https://alavihospitals.in";

// Local storage fallback file path
const getFallbackFilePath = () => {
    const tmpDir = os.tmpdir();
    return path.join(tmpDir, "alavi_llms_config.json");
};

// Doctor name sanitizer to reliably ensure clean "Dr. Name" without duplicate "Dr. Dr."
export const formatDoctorName = (name: string): string => {
    let clean = (name || "").trim();
    if (!clean) return "";
    // Strip any leading occurrences of Dr / Dr. / DR / repeated Dr. Dr.
    while (/^dr\.?\s*/i.test(clean)) {
        clean = clean.replace(/^dr\.?\s*/i, "").trim();
    }
    if (!clean) return "";
    // Ensure the first character is capitalized
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    return `Dr. ${clean}`;
};

// Slug normalizer matching client sitemap
export const normalizeSlug = (raw: string | undefined, sectionPrefix: string): string =>
    (raw || "")
        .trim()
        .replace(new RegExp(`^/?(${sectionPrefix}/)?`), "")
        .replace(/\/+$/, "");

// Standard default sections for Alavi Hospitals
export const DEFAULT_CUSTOM_SECTIONS = [
    {
        id: "sec-1",
        title: "Core Hospital Resources & Patient Services",
        description: "Official online portals, contact channels, and medical departments at Alavi Hospitals.",
        items: [
            {
                title: "Alavi Hospitals Official Homepage",
                url: `${BASE_URL}/`,
                description: "Leading multi-speciality tertiary healthcare hospital in Hyderabad, India"
            },
            {
                title: "About Alavi Hospitals",
                url: `${BASE_URL}/about`,
                description: "Leadership, clinical excellence, modern infrastructure, and patient-first healthcare"
            },
            {
                title: "Consultant Specialists & Doctors Directory",
                url: `${BASE_URL}/doctors`,
                description: "Directory of senior surgeons, physicians, and medical consultants"
            },
            {
                title: "Centres of Excellence & Specialities",
                url: `${BASE_URL}/specialities`,
                description: "Specialized clinical departments including Cardiology, Neurosciences, Orthopaedics, and Oncology"
            },
            {
                title: "Treatments & Surgical Procedures",
                url: `${BASE_URL}/treatments`,
                description: "Comprehensive medical treatments, minimally invasive and robotic surgeries"
            },
            {
                title: "Preventive Health Checkup Packages",
                url: `${BASE_URL}/health-packages`,
                description: "Comprehensive master health screenings and specialized wellness packages"
            },
            {
                title: "Medical Second Opinion Services",
                url: `${BASE_URL}/second-opinion`,
                description: "Confidential surgical second opinions and expert clinical case reviews"
            },
            {
                title: "Cashless Insurance & TPA Network",
                url: `${BASE_URL}/insurance`,
                description: "Empanelled government schemes, private insurance companies, and TPA partners"
            },
            {
                title: "Vaccination & Immunisation Centre",
                url: `${BASE_URL}/vaccinations`,
                description: "Adult and paediatric vaccination schedules and immunisation services"
            },
            {
                title: "Health Articles & Patient Education Blog",
                url: `${BASE_URL}/blog`,
                description: "Doctor-written medical guides, wellness insights, and disease prevention articles"
            },
            {
                title: "Contact, Appointments & Emergency",
                url: `${BASE_URL}/contact`,
                description: "24/7 emergency hotline, consultation bookings, and hospital address"
            }
        ]
    },
    {
        id: "sec-2",
        title: "Key Medical Specialities",
        description: "Specialised clinical departments offering advanced diagnosis, medical management, and surgical intervention.",
        items: [
            {
                title: "Cardiology & Cardiovascular Sciences",
                url: `${BASE_URL}/specialities/cardiology`,
                description: "Interventional cardiology, cardiac surgery, angiography, and intensive coronary care"
            },
            {
                title: "Neurosciences & Neurology",
                url: `${BASE_URL}/specialities/neuro-sciences`,
                description: "Advanced brain and spine surgery, stroke management, and neurology care"
            },
            {
                title: "Orthopaedics & Joint Replacement",
                url: `${BASE_URL}/specialities/orthopaedics`,
                description: "Knee replacement, hip replacement, trauma care, and arthroscopic procedures"
            },
            {
                title: "Gastroenterology & Hepatology",
                url: `${BASE_URL}/specialities/gastroenterology`,
                description: "Medical & surgical gastroenterology, endoscopy, and liver disease management"
            },
            {
                title: "Nephrology & Renal Sciences",
                url: `${BASE_URL}/specialities/nephrology`,
                description: "Kidney disease treatment, dialysis centre, and hypertension management"
            },
            {
                title: "Urology & Andrology",
                url: `${BASE_URL}/specialities/urology`,
                description: "Kidney stone removal, prostate treatment, and reconstructive urology"
            },
            {
                title: "Oncology & Cancer Care",
                url: `${BASE_URL}/specialities/oncology`,
                description: "Surgical oncology, medical oncology, chemotherapy, and tumor screening"
            },
            {
                title: "Pulmonology & Respiratory Medicine",
                url: `${BASE_URL}/specialities/pulmonology`,
                description: "Asthma, COPD, sleep disorders, and advanced pulmonary intervention"
            }
        ]
    },
    {
        id: "sec-3",
        title: "Patient Care Guidelines & Information",
        description: "Essential information for patients and visitors regarding admission, facilities, and visitor protocols.",
        items: [
            {
                title: "Admission & Discharge Guidelines",
                url: `${BASE_URL}/admission-guidelines`,
                description: "Standard operating procedures for planned and emergency admissions"
            },
            {
                title: "Patient & Visitor Guidelines",
                url: `${BASE_URL}/patient-visitor-guidelines`,
                description: "Visiting hours, ICU protocols, hospital safety regulations, and patient support"
            },
            {
                title: "Patient Care & Services Overview",
                url: `${BASE_URL}/patients`,
                description: "Comprehensive inpatient and outpatient facilities, diagnostic labs, and pharmacy"
            }
        ]
    }
];

export const getDefaultLlmsConfig = () => {
    return {
        id: "1",
        title: "Alavi Hospitals",
        summary: "Alavi Hospitals is a premier multi-speciality tertiary healthcare hospital in Hyderabad, India, offering advanced medical care across cardiology, neurosciences, orthopaedics, oncology, gastroenterology, nephrology, urology, and 24/7 critical care.",
        homepage: BASE_URL,
        enabled: true,
        systemNotes: "Alavi Hospitals is a premier multi-speciality medical group in Hyderabad, Telangana, India. All content provided here represents official clinical services, doctors, medical departments, and treatments.",
        dynamicSections: {
            includeDoctors: true,
            includeBlogs: true,
            includeSpecialities: true,
            includeTreatments: true,
            includeHealthPackages: true,
            includeSecondOpinion: true,
        },
        customSections: DEFAULT_CUSTOM_SECTIONS,
        useRawOverride: false,
        rawMarkdownOverride: "",
        fullTxtContent: "",
    };
};

// Fetch LLMs Config with DynamoDB & Local Fallback
export const getLlmsConfig = async (): Promise<any> => {
    // 1. Try DynamoDB
    try {
        const result = await db.send(new GetCommand({
            TableName: TABLE_NAME_LLMS_CONFIG,
            Key: { id: "1" }
        }));
        if (result && result.Item && result.Item.title) {
            return result.Item;
        }
    } catch (error: any) {
        console.warn("DynamoDB LlmsConfig get notice (falling back):", error?.message || error);
    }

    // 2. Try Fallback Local File
    try {
        const filePath = getFallbackFilePath();
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf-8");
            const parsed = JSON.parse(data);
            if (parsed && parsed.title) {
                return parsed;
            }
        }
    } catch (err: any) {
        console.warn("Fallback file read notice:", err?.message || err);
    }

    // 3. Return Default
    return getDefaultLlmsConfig();
};

// Save LLMs Config to DynamoDB & Local Fallback
export const saveLlmsConfig = async (configData: any): Promise<any> => {
    const item = {
        id: "1",
        ...configData,
        updatedAt: new Date().toISOString()
    };

    let savedToDb = false;

    // 1. Save to DynamoDB
    try {
        await db.send(new PutCommand({
            TableName: TABLE_NAME_LLMS_CONFIG,
            Item: item
        }));
        savedToDb = true;
    } catch (error: any) {
        console.warn("DynamoDB LlmsConfig put notice (saving to local file fallback):", error?.message || error);
    }

    // 2. Always persist to local fallback file for stability
    try {
        const filePath = getFallbackFilePath();
        fs.writeFileSync(filePath, JSON.stringify(item, null, 2), "utf-8");
    } catch (fileErr: any) {
        console.warn("Local fallback file write notice:", fileErr?.message || fileErr);
    }

    return {
        success: true,
        message: savedToDb ? "LLMs configuration saved successfully" : "LLMs configuration saved to local storage fallback",
        config: item
    };
};

// Compile Live Markdown content for /llms.txt
export const generateLlmsTxtContent = (config: any, dynamicData: any = {}): string => {
    const cfg = config || getDefaultLlmsConfig();

    // If manual raw override is active, output directly
    if (cfg.useRawOverride && cfg.rawMarkdownOverride && cfg.rawMarkdownOverride.trim() !== "") {
        return cfg.rawMarkdownOverride.trim();
    }

    const output: string[] = [];

    // 1. Header Title
    output.push(`# ${cfg.title || "Alavi Hospitals"}`);
    output.push("");

    // 2. Summary
    if (cfg.summary) {
        output.push(`> ${cfg.summary.trim()}`);
        output.push("");
    }

    // 3. Homepage
    if (cfg.homepage) {
        output.push(`- Homepage: ${cfg.homepage.trim()}`);
        output.push("");
    }

    // 4. System Directives for AI
    if (cfg.systemNotes) {
        output.push(`> Note for AI & Large Language Models: ${cfg.systemNotes.trim()}`);
        output.push("");
    }

    // 5. Custom Structured Sections
    if (Array.isArray(cfg.customSections)) {
        cfg.customSections.forEach((sec: any) => {
            if (!sec.title) return;
            const secTitle = sec.title.startsWith("#") ? sec.title : `## ${sec.title}`;
            output.push(secTitle);
            if (sec.description && sec.description.trim()) {
                output.push(`> ${sec.description.trim()}`);
            }
            output.push("");

            if (Array.isArray(sec.items)) {
                sec.items.forEach((item: any) => {
                    if (!item.title || !item.url) return;
                    let line = `- [${item.title.trim()}](${item.url.trim()})`;
                    if (item.description && item.description.trim()) {
                        line += `\t[${item.description.trim()}]`;
                    }
                    output.push(line);
                });
            }
            output.push("");
        });
    }

    // 6. Dynamic Section: Doctors
    if (cfg.dynamicSections?.includeDoctors && Array.isArray(dynamicData.doctors) && dynamicData.doctors.length > 0) {
        output.push("## Our Medical Specialists & Doctors");
        output.push("> Senior clinicians, consultants, and surgical specialists at Alavi Hospitals.");
        output.push("");

        dynamicData.doctors.forEach((doc: any) => {
            const docName = formatDoctorName(doc.name || doc.doctorId || "");
            const dept = doc.department ? ` - ${doc.department}` : "";
            let url = `${BASE_URL}/doctors/${doc.url || doc.doctorId}`;
            if (doc.url && doc.url.startsWith("http")) {
                url = doc.url;
            }
            const designation = doc.designation || (Array.isArray(doc.designations) && doc.designations[0]) || "Consultant Specialist";
            const desc = `${designation} at Alavi Hospitals`;
            output.push(`- [${docName}${dept}](${url})\t[${desc}]`);
        });
        output.push("");
    }

    // 7. Dynamic Section: Blogs & Health Insights
    if (cfg.dynamicSections?.includeBlogs && Array.isArray(dynamicData.blogs) && dynamicData.blogs.length > 0) {
        output.push("## Health Articles & Medical Insights");
        output.push("> Verified medical articles, healthcare insights, and wellness education by Alavi Hospitals clinicians.");
        output.push("");

        dynamicData.blogs.slice(0, 50).forEach((blog: any) => {
            const title = (blog.blogTitle || "Health Article").trim();
            let url = `${BASE_URL}/blog/${normalizeSlug(blog.url, "blog") || blog.blogId}`;
            if (blog.url && blog.url.startsWith("http")) {
                url = blog.url;
            }
            const desc = (blog.metaDescription || blog.seoTitle || "Comprehensive medical guide from Alavi Hospitals").trim();
            output.push(`- [${title}](${url})\t[${desc}]`);
        });
        output.push("");
    }

    // 8. Dynamic Section: Speciality Pages
    if (cfg.dynamicSections?.includeSpecialities && Array.isArray(dynamicData.specialities) && dynamicData.specialities.length > 0) {
        output.push("## Speciality Centres of Excellence");
        output.push("> Dedicated hospital departments and surgical disciplines.");
        output.push("");

        dynamicData.specialities.forEach((spec: any) => {
            const title = (spec.title || spec.specialityName || "Speciality").trim();
            const slug = spec.seoConfig?.url ? normalizeSlug(spec.seoConfig.url, "specialities") : normalizeSlug(spec.specialityName, "specialities");
            const url = `${BASE_URL}/specialities/${slug}`;
            const desc = (spec.seoConfig?.metaDescription || spec.description || "Centre of Excellence at Alavi Hospitals").trim();
            output.push(`- [${title}](${url})\t[${desc}]`);
        });
        output.push("");
    }

    // 9. Dynamic Section: Treatments
    if (cfg.dynamicSections?.includeTreatments && Array.isArray(dynamicData.treatments) && dynamicData.treatments.length > 0) {
        output.push("## Medical Treatments & Surgical Procedures");
        output.push("> Advanced clinical interventions, minimally invasive procedures, and disease treatments.");
        output.push("");

        dynamicData.treatments.forEach((treat: any) => {
            const title = (treat.title || treat.itemTitle || "Treatment Procedure").trim();
            const slug = treat.seoConfig?.url ? normalizeSlug(treat.seoConfig.url, "treatments") : treat.treatmentId;
            const url = `${BASE_URL}/treatments/${slug}`;
            const desc = (treat.subtitle || treat.seoConfig?.metaDescription || `Specialised treatment for ${treat.specialityName || 'patients'}`).trim();
            output.push(`- [${title}](${url})\t[${desc}]`);
        });
        output.push("");
    }

    // 10. Dynamic Section: Health Packages
    if (cfg.dynamicSections?.includeHealthPackages && Array.isArray(dynamicData.healthPackages) && dynamicData.healthPackages.length > 0) {
        output.push("## Preventive Health Checkup Packages");
        output.push("> Comprehensive wellness screenings, diagnostic profiles, and master health checkups.");
        output.push("");

        dynamicData.healthPackages.forEach((pkg: any) => {
            const title = (pkg.cardTitle || pkg.pageTitle || "Health Checkup Package").trim();
            const slug = pkg.seoConfig?.url ? normalizeSlug(pkg.seoConfig.url, "health-packages") : pkg.healthPackageId;
            const url = `${BASE_URL}/health-packages/${slug}`;
            const priceInfo = pkg.discountedPrice ? ` (₹${pkg.discountedPrice})` : "";
            const desc = `${pkg.cardDescription || pkg.diseasesScreened || "Preventive health screening"}${priceInfo}`;
            output.push(`- [${title}](${url})\t[${desc}]`);
        });
        output.push("");
    }

    // 11. Dynamic Section: Second Opinion Topics
    if (cfg.dynamicSections?.includeSecondOpinion && Array.isArray(dynamicData.secondOpinions) && dynamicData.secondOpinions.length > 0) {
        output.push("## Second Opinion Surgical Services");
        output.push("> Expert clinical evaluations and second opinions before undergoing major surgical procedures.");
        output.push("");

        dynamicData.secondOpinions.forEach((topic: any) => {
            const title = `${(topic.title || "Surgical").trim()} - Expert Second Opinion`;
            const slug = topic.seoConfig?.url ? normalizeSlug(topic.seoConfig.url, "second-opinion") : topic.secondOpinionId;
            const url = `${BASE_URL}/second-opinion/${slug}`;
            const desc = (topic.heroHeading || topic.seoConfig?.metaDescription || "Expert second opinion prior to surgery").trim();
            output.push(`- [${title}](${url})\t[${desc}]`);
        });
        output.push("");
    }

    return output.join("\n").trim();
};

// Compile Extended Markdown content for /llms-full.txt
export const generateLlmsFullTxtContent = (config: any, dynamicData: any = {}): string => {
    const cfg = config || getDefaultLlmsConfig();

    if (cfg.fullTxtContent && cfg.fullTxtContent.trim() !== "") {
        return cfg.fullTxtContent.trim();
    }

    const baseTxt = generateLlmsTxtContent(cfg, dynamicData);
    const fullOutput: string[] = [baseTxt];

    fullOutput.push("\n\n==================================================");
    fullOutput.push("FULL COMPREHENSIVE RESOURCE DIRECTORY FOR LLM CONTEXT");
    fullOutput.push("==================================================\n");

    // Detailed Doctors Index
    if (Array.isArray(dynamicData.doctors) && dynamicData.doctors.length > 0) {
        fullOutput.push("### Doctors Detailed Clinical Directory");
        dynamicData.doctors.forEach((doc: any) => {
            const name = formatDoctorName(doc.name || doc.doctorId || "");
            const dept = doc.department || "General Medicine";
            const qual = doc.qualification || "MBBS, MD";
            const desig = doc.designation || (Array.isArray(doc.designations) && doc.designations[0]) || "Consultant Specialist";
            const exp = doc.experience ? ` | Experience: ${doc.experience}` : "";
            fullOutput.push(`- **${name}** | Department: ${dept} | Designation: ${desig} | Qualification: ${qual}${exp}`);
        });
        fullOutput.push("");
    }

    // Detailed Blogs Index
    if (Array.isArray(dynamicData.blogs) && dynamicData.blogs.length > 0) {
        fullOutput.push("### Articles & Medical Guides Detailed Index");
        dynamicData.blogs.forEach((blog: any) => {
            const title = (blog.blogTitle || "Health Article").trim();
            const author = blog.author || "Alavi Medical Team";
            const cats = Array.isArray(blog.categories) ? blog.categories.join(", ") : (blog.categories || "General Health");
            const desc = blog.metaDescription || blog.seoTitle || "Comprehensive medical guide.";
            fullOutput.push(`- **${title}** | Author: ${author} | Category: ${cats} | Summary: ${desc}`);
        });
        fullOutput.push("");
    }

    // Detailed Treatments Index
    if (Array.isArray(dynamicData.treatments) && dynamicData.treatments.length > 0) {
        fullOutput.push("### Treatments & Surgical Procedures Detailed Index");
        dynamicData.treatments.forEach((treat: any) => {
            const title = (treat.title || treat.itemTitle || "Treatment").trim();
            const spec = treat.specialityName || "General";
            const sub = treat.subtitle || treat.badgeLabel || "Clinical Care";
            fullOutput.push(`- **${title}** | Speciality: ${spec} | Overview: ${sub}`);
        });
        fullOutput.push("");
    }

    // Detailed Health Packages Index
    if (Array.isArray(dynamicData.healthPackages) && dynamicData.healthPackages.length > 0) {
        fullOutput.push("### Health Packages & Preventive Screenings Index");
        dynamicData.healthPackages.forEach((pkg: any) => {
            const title = (pkg.cardTitle || pkg.pageTitle || "Health Package").trim();
            const tests = pkg.testsCountLabel || `${pkg.testGroups?.length || 0} Test Groups`;
            const price = pkg.discountedPrice ? `Price: ₹${pkg.discountedPrice}` : "Contact Hospital";
            fullOutput.push(`- **${title}** | ${tests} | ${price} | For: ${pkg.recommendedFor || "Men & Women"}`);
        });
        fullOutput.push("");
    }

    return fullOutput.join("\n").trim();
};

// Helper to fetch live DB models for dynamic sections
const fetchLiveDynamicData = async (dynamicSections: any = {}) => {
    const dynamicData: any = {
        doctors: [],
        blogs: [],
        specialities: [],
        treatments: [],
        healthPackages: [],
        secondOpinions: []
    };

    const promises: Promise<void>[] = [];

    // 1. Doctors
    if (dynamicSections.includeDoctors !== false) {
        promises.push((async () => {
            try {
                const res = await db.send(new ScanCommand({ TableName: TABLE_NAME_DOCTORS }));
                const docs = (res.Items || []).filter((d: any) => d.enabled !== false);
                dynamicData.doctors = docs;
            } catch (err: any) {
                console.warn("Dynamic fetch doctors notice:", err?.message || err);
            }
        })());
    }

    // 2. Blogs
    if (dynamicSections.includeBlogs !== false) {
        promises.push((async () => {
            try {
                const res = await db.send(new ScanCommand({ TableName: TABLE_NAME_BLOGS }));
                const blogs = (res.Items || []).filter((b: any) => b.enabled !== false);
                dynamicData.blogs = blogs;
            } catch (err: any) {
                console.warn("Dynamic fetch blogs notice:", err?.message || err);
            }
        })());
    }

    // 3. Specialities
    if (dynamicSections.includeSpecialities !== false) {
        promises.push((async () => {
            try {
                const res = await db.send(new ScanCommand({ TableName: TABLE_NAME_SPECIALITY_PAGES }));
                const specs = (res.Items || []).filter((s: any) => s.enabled !== false);
                dynamicData.specialities = specs;
            } catch (err: any) {
                // Fallback to core Specialities table if SpecialityPages table query fails
                try {
                    const res2 = await db.send(new ScanCommand({ TableName: TABLE_NAME_SPECIALITIES }));
                    dynamicData.specialities = (res2.Items || []).filter((s: any) => s.enabled !== false);
                } catch (e2) { }
            }
        })());
    }

    // 4. Treatments
    if (dynamicSections.includeTreatments !== false) {
        promises.push((async () => {
            try {
                const res = await db.send(new ScanCommand({ TableName: TABLE_NAME_TREATMENTS }));
                const treats = (res.Items || []).filter((t: any) => t.enabled !== false);
                dynamicData.treatments = treats;
            } catch (err: any) {
                console.warn("Dynamic fetch treatments notice:", err?.message || err);
            }
        })());
    }

    // 5. Health Packages
    if (dynamicSections.includeHealthPackages !== false) {
        promises.push((async () => {
            try {
                const res = await db.send(new ScanCommand({ TableName: TABLE_NAME_HEALTH_PACKAGES }));
                const pkgs = (res.Items || []).filter((p: any) => p.enabled !== false);
                dynamicData.healthPackages = pkgs;
            } catch (err: any) {
                console.warn("Dynamic fetch health packages notice:", err?.message || err);
            }
        })());
    }

    // 6. Second Opinion
    if (dynamicSections.includeSecondOpinion !== false) {
        promises.push((async () => {
            try {
                const res = await db.send(new ScanCommand({ TableName: TABLE_NAME_SECOND_OPINIONS }));
                const opinions = (res.Items || []).filter((o: any) => o.enabled !== false);
                dynamicData.secondOpinions = opinions;
            } catch (err: any) {
                console.warn("Dynamic fetch second opinions notice:", err?.message || err);
            }
        })());
    }

    await Promise.allSettled(promises);
    return dynamicData;
};

// ==========================================
// EXPRESS ROUTE HANDLERS
// ==========================================

// GET /api/llms-config
export const getConfigHandler = async (_req: any, res: any) => {
    try {
        const config = await getLlmsConfig();
        return res.status(200).json(config);
    } catch (error: any) {
        console.error("Get LLMs config error:", error);
        return res.status(500).json({ error: "Failed to fetch LLMs configuration", details: error?.message });
    }
};

// POST /api/llms-config
export const saveConfigHandler = async (req: any, res: any) => {
    try {
        const configData = req.body;
        if (!configData || typeof configData !== "object") {
            return res.status(400).json({ error: "Invalid configuration payload" });
        }
        const result = await saveLlmsConfig(configData);
        return res.status(200).json(result);
    } catch (error: any) {
        console.error("Save LLMs config error:", error);
        return res.status(500).json({ error: "Failed to save LLMs configuration", details: error?.message });
    }
};

// GET /llms.txt (Public text endpoint)
export const getLlmsTxtHandler = async (_req: any, res: any) => {
    try {
        const config = await getLlmsConfig();

        if (config.enabled === false) {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            return res.status(200).send("# Alavi Hospitals\n\nLLMs.txt is currently disabled by administrator.");
        }

        const dynamicData = await fetchLiveDynamicData(config.dynamicSections || {});
        const content = generateLlmsTxtContent(config, dynamicData);

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
        return res.status(200).send(content);
    } catch (error: any) {
        console.error("GET /llms.txt error:", error);
        const defaultContent = generateLlmsTxtContent(getDefaultLlmsConfig());
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        return res.status(200).send(defaultContent);
    }
};

// GET /llms-full.txt (Extended markdown endpoint)
export const getLlmsFullTxtHandler = async (_req: any, res: any) => {
    try {
        const config = await getLlmsConfig();

        if (config.enabled === false) {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            return res.status(200).send("# Alavi Hospitals\n\nLLMs-full.txt is currently disabled by administrator.");
        }

        const dynamicData = await fetchLiveDynamicData(config.dynamicSections || {});
        const content = generateLlmsFullTxtContent(config, dynamicData);

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
        return res.status(200).send(content);
    } catch (error: any) {
        console.error("GET /llms-full.txt error:", error);
        const defaultContent = generateLlmsFullTxtContent(getDefaultLlmsConfig());
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        return res.status(200).send(defaultContent);
    }
};
