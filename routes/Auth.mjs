import express from "express";
const router = express.Router();
import {
  createUser,
  LoginUser,
  checkOut,
  SaveData,
  getData,
  dltData,
  updateData
} from "../controller/Auth.mjs";

router.post("/register", (req, res) => {
  createUser(req, res);
});

router.post("/login", async (req, res) => {
  LoginUser(req, res);
});

router.post("/checkout", async (req, res) => {
  checkOut(req, res);
});

router.post("/saveData", async (req, res) => {
  SaveData(req, res);
});

router.get("/getDrawing/:randomId", async (req, res) => {
//   console.log("GET request received"); // Add this line
  getData(req, res);
});


router.delete("/deleteDrawing", async (req, res) => {
  dltData(req, res);
});

router.put("/updateData/:randomId", async (req, res) => {
  updateData(req, res);
});



export default router;

