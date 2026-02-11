import express from "express";
import { registerCompany,getCompany,getCompanyById,updateCompany  } from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"

const router = express.Router();

// creating routes for recuiter to create and post companies.
// Recuiter can create company only if he is authenticated.
// so add isAuthenticated in each router before post/get request.

router.route("/register").post(isAuthenticated,registerCompany);
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated,updateCompany);

export default router;