import express from "express";
const router = express.Router();
import {createUser,loginUser} from "../controller/Auth.mjs";

router.post("/register", (req, res) => {
  createUser(req, res);
});

router.post("/login", async (req, res) => {
  loginUser(req, res);
});


export default router;

