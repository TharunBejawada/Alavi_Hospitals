import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { createUser, getAllUsers } from "./controllers/userController.js";
import { login } from "./controllers/authController.js";
import { 
  addBlog, getAllBlogs, getBlogById, getBlogByURL, updateBlog, toggleBlogStatus, uploadBlogImage, getBlogsByDepartmentKeywords
} from "./controllers/blogController.js";
import { 
  addDoctor, getAllDoctors, getDoctorById, getDoctorByURL, updateDoctor, toggleDoctorStatus, uploadDoctorImage, getAllEnabledDoctors, getDoctorsByDepartment
} from "./controllers/doctorController.js";
import { setDoctorAvailability, getDoctorAvailability } from "./controllers/availabilityController.js";
import * as specialityController from "./controllers/specialityController.js";
import * as specialityPageController from "./controllers/specialityPageController.js";
import * as treatmentController from "./controllers/treatmentController.js";
import * as secondOpinionController from "./controllers/secondOpinionController.js";
import * as vaccineController from "./controllers/vaccineController.js";
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
app.get("/api/blogs/getBlogsByDepartmentKeywords/:department", getBlogsByDepartmentKeywords);

// ---> ADD DOCTOR ROUTES <---
app.get("/api/doctors/getAllDoctors", getAllDoctors);
app.get("/api/doctors/getAllEnabledDoctors", getAllEnabledDoctors);
app.post("/api/doctors/addDoctor", addDoctor);
app.get("/api/doctors/getDoctorbyId/:id", getDoctorById);
app.get("/api/doctors/getDoctorByUrl/:url", getDoctorByURL);
app.put("/api/doctors/updateDoctor/:id", updateDoctor);
app.put("/api/doctors/:id/toggle", toggleDoctorStatus);
app.post("/api/doctors/uploadDoctorImage", upload.single("image"), uploadDoctorImage);
app.get("/api/doctors/getDoctorsByDepartment/:department", getDoctorsByDepartment);

app.post("/api/availability/setDoctorAvailability", setDoctorAvailability);
app.get("/api/availability/getDoctorAvailability/:doctorId", getDoctorAvailability);

app.post("/api/specialities/addSpeciality", specialityController.addSpeciality);
app.get("/api/specialities/getAllSpecialities", specialityController.getAllSpecialities);
app.get("/api/specialities/getAllEnabledSpecialities", specialityController.getAllEnabledSpecialities);
app.get("/api/specialities/getSpecialityById/:id", specialityController.getSpecialityById);
app.put("/api/specialities/updateSpeciality/:id", specialityController.updateSpeciality);
app.put("/api/specialities/toggleStatus/:id", specialityController.toggleSpecialityStatus);
app.delete("/api/specialities/deleteSpeciality/:id", specialityController.deleteSpeciality);
app.post("/api/specialities/uploadImage", upload.single("image"), specialityController.uploadSpecialityImage);

app.post("/api/speciality-pages/add", specialityPageController.addSpecialityPage);
app.get("/api/speciality-pages/getAll", specialityPageController.getAllSpecialityPages);
app.get("/api/speciality-pages/getById/:id", specialityPageController.getSpecialityPageById);
app.put("/api/speciality-pages/update/:id", specialityPageController.updateSpecialityPage);
app.delete("/api/speciality-pages/delete/:id", specialityPageController.deleteSpecialityPage);

app.post("/api/treatments/add", treatmentController.addTreatment);
app.get("/api/treatments/getAll", treatmentController.getAllTreatments);
app.get("/api/treatments/getBySpeciality/:specialityId", treatmentController.getTreatmentsBySpeciality);
app.get("/api/treatments/getById/:id", treatmentController.getTreatmentById);
app.get("/api/treatments/getByUrl/:url", treatmentController.getTreatmentByUrl);
app.put("/api/treatments/update/:id", treatmentController.updateTreatment);
app.put("/api/treatments/:id/toggle", treatmentController.toggleTreatmentStatus);
app.delete("/api/treatments/delete/:id", treatmentController.deleteTreatment);
app.post("/api/treatments/uploadImage", upload.single("image"), treatmentController.uploadTreatmentImage);

app.post("/api/second-opinions/add", secondOpinionController.addSecondOpinion);
app.get("/api/second-opinions/getAll", secondOpinionController.getAllSecondOpinions);
app.get("/api/second-opinions/getAllEnabled", secondOpinionController.getAllEnabledSecondOpinions);
app.get("/api/second-opinions/getById/:id", secondOpinionController.getSecondOpinionById);
app.get("/api/second-opinions/getByUrl/:url", secondOpinionController.getSecondOpinionByUrl);
app.put("/api/second-opinions/update/:id", secondOpinionController.updateSecondOpinion);
app.put("/api/second-opinions/:id/toggle", secondOpinionController.toggleSecondOpinionStatus);
app.delete("/api/second-opinions/delete/:id", secondOpinionController.deleteSecondOpinion);
app.post("/api/second-opinions/uploadImage", upload.single("image"), secondOpinionController.uploadSecondOpinionImage);
app.post("/api/second-opinions/uploadReport", upload.single("file"), secondOpinionController.uploadSecondOpinionReport);

app.post("/api/vaccines/add", vaccineController.addVaccine);
app.get("/api/vaccines/getAll", vaccineController.getAllVaccines);
app.get("/api/vaccines/getAllEnabled", vaccineController.getAllEnabledVaccines);
app.get("/api/vaccines/getById/:id", vaccineController.getVaccineById);
app.put("/api/vaccines/update/:id", vaccineController.updateVaccine);
app.put("/api/vaccines/:id/toggle", vaccineController.toggleVaccineStatus);
app.delete("/api/vaccines/delete/:id", vaccineController.deleteVaccine);

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

export const handler = serverless(app);