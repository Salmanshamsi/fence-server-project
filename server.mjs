import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import "./config/index.mjs";
import Auth from './routes/Auth.mjs';
import Design from "./routes/Design.mjs";
import CheckOut from "./routes/Payment.mjs";

// ....server initiallization..

const app = express();
const port = process.env.PORT ||  3000;

//  Middlewares...

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd() + "/public" )));


// mongoose initialization...

mongoose.connect(process.env.MONGO_DB_URI).then(()=>{
  console.log("connected sucessfully !");
}).catch((err)=>{
  console.log("connection Error : !" + err);
})


// ........APIs.......................

app.use('/design',Design);
app.use('/payment',CheckOut);
app.use('/auth',Auth);

// ------------------------------------


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 
