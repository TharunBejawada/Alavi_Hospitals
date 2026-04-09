import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { createUser, getAllUsers } from "./controllers/userController.js";
import { login } from "./controllers/authController.js";
import { 
  addBlog, getAllBlogs, getBlogById, getBlogByURL, updateBlog, toggleBlogStatus, uploadBlogImage 
} from "./controllers/blogController.js";
import { 
  addDoctor, getAllDoctors, getDoctorById, getDoctorByURL, updateDoctor, toggleDoctorStatus, uploadDoctorImage, getAllEnabledDoctors
} from "./controllers/doctorController.js";
import { setDoctorAvailability, getDoctorAvailability } from "./controllers/availabilityController.js";
import serverless from "serverless-http";

dotenv.config();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // Limit to 5MB
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Alavi Hospitals API is running...");
});

// User Routes
app.post("/api/users", createUser);
app.get("/api/users", getAllUsers);

app.post("/api/auth/login", login);

app.get("/api/blogs/getAllBlogs", getAllBlogs);
app.post("/api/blogs/addBlog", addBlog);
app.get("/api/blogs/getBlogbyId/:id", getBlogById);
app.get("/api/blogs/getBlogByUrl/:url", getBlogByURL);
app.put("/api/blogs/updateBlog/:id", updateBlog);
app.put("/api/blogs/:id/toggle", toggleBlogStatus);
app.post("/api/blogs/uploadblogImage", upload.single("image"), uploadBlogImage);

// ---> ADD DOCTOR ROUTES <---
app.get("/api/doctors/getAllDoctors", getAllDoctors);
app.get("/api/doctors/getAllEnabledDoctors", getAllEnabledDoctors);
app.post("/api/doctors/addDoctor", addDoctor);
app.get("/api/doctors/getDoctorbyId/:id", getDoctorById);
app.get("/api/doctors/getDoctorByUrl/:url", getDoctorByURL);
app.put("/api/doctors/updateDoctor/:id", updateDoctor);
app.put("/api/doctors/:id/toggle", toggleDoctorStatus);
app.post("/api/doctors/uploadDoctorImage", upload.single("image"), uploadDoctorImage);

app.post("/api/availability/setDoctorAvailability", setDoctorAvailability);
app.get("/api/availability/getDoctorAvailability/:doctorId", getDoctorAvailability);

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

export const handler = serverless(app);