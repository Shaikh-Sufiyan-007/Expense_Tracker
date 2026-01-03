import { addIncome, deleteIncome, downloadIncomeExcel, getAllIncomes } from "../controllers/income.controller.js";
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncomes);
router.get("/downloadexcel", protect, downloadIncomeExcel);
router.delete("/:id", protect, deleteIncome);

export default router