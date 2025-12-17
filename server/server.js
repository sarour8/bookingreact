import express from 'express';
import "dotenv/config.js";
import cors from 'cors';
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';

connectDB();
const app = express();


// IMPORTANT : webhook AVANT express.json
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);
app.use(cors()); // Enable CORS for all routes

// autres middlewares APRES
app.use(express.json());
app.use(clerkMiddleware());




app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);


});
//database pssword : Co1rerkUdnOWYeCb