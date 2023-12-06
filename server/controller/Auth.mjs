// Import the Drawing model
import mongoose from "mongoose";
import Drawing from "../modal/designIdSchema.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "../config/index.mjs";
import User from "../modal/userSchema.mjs";
import Stripe from "stripe";
import Design from "../modal/designIdSchema.mjs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exist" });
    }

    const user = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  const checkUser = await User.findOne({ email });

  if (!checkUser) {
    return res.json({ error: "User Not Found!" });
  }

  if (await bcrypt.compare(password, checkUser.password)) {
    const token = jwt.sign(
      { email: checkUser.email },
      process.env.JWT_SECRET_KEY
    );
    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  return res.json({ status: "error", error: "Invalid Password" });
};

const checkOut = async (req, res) => {
  try {
    const sessions = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment", // Corrected typo here
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: sessions.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const SaveData = async (req, res) => {
  const { randomId, lines, pstTime } = req.body;

  try {
    // Create a new instance of the Drawing model
    const drawing = new Drawing({
      randomId,
      lines,
      pstTime,
    });

    // Save the drawing to the database
    await drawing.save();

    console.log("Data saved successfully:", { randomId, lines, pstTime });

    res.status(201).json({ message: "Data saved successfully" });
  } catch (err) {
    console.log("Error while calling saveData Api:", err);
    res.status(500).json({ error: err.message });
  }
};



const getData = async (req,res) => {

    const { randomId } = req.params;
  
    try {
      // Find the drawing by randomId in the database
      const drawing = await Drawing.findOne({ randomId });
  
      if (!drawing) {
        return res.status(404).json({ message: 'Drawing not found' });
      }
  
      res.status(200).json(drawing);
    } catch (err) {
      console.log('Error while fetching drawing by randomId:', err);
      res.status(500).json({ error: err.message });
    }
}


const dltData = async (req, res) => { 
  const { randomId } = req.body;

  try {
    await Drawing.deleteOne({ _id: randomId });
    res.send({ status: "OK", data: "DELETED" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


const updateData = async (req, res) => {

  const id = req.params.randomId;
  const upd_data = req.body.lines;

  
  console.log("Data :" + upd_data );
  console.log(" id : " + id );

  try {

    const result = await Drawing.updateOne({ randomId: id }, { $set: { lines: upd_data} });
    
    if (result.modifiedCount === 1) {
      res.send("Update successful");
    } else {
      res.send("Data not found");
    }
  } catch (error) {
    console.error("Error updating todo item:", error); // Log the error to check what went wrong
    res.status(500).send("Error updating");
  }
};

export { createUser, LoginUser, checkOut, SaveData , getData , dltData , updateData};