import express from "express";
const router = express.Router();
import { checkOut } from "../controller/Payment.mjs";

router.post("/checkout", async (req, res) => {
  checkOut(req, res);
});


export default router;

