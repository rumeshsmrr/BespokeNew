import express from "express";
import {
	createPurchaseHistory,
	getPurchaseHistoryByUser,
	getAllPurchaseHistories,
	deletePurchaseHistory,
} from "../Controllers/PurchaseHistoryCtrl.js";

const router = express.Router();

router.post("/", createPurchaseHistory);
router.get("/user/:userId", getPurchaseHistoryByUser);
router.get("/", getAllPurchaseHistories);
router.delete("/:id", deletePurchaseHistory);

export default router;
