import express from "express";
const router = express.Router();
import {deleteData, getData, saveData, updateData} from "../controller/Design.mjs"


router.post("/save",(req, res) => {
  saveData(req, res);
});

router.get("/get/:randomId",(req, res) => {
  getData(req, res);
});

router.delete("/delete/:randomId",(req, res) => {
  deleteData(req, res);
});


router.put("/update/:randomId",(req, res) => {
  updateData(req, res);
});



export default router;

