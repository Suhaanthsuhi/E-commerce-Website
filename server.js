import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoute.js";
import userRoutes from "./routes/userRoute.js";
import cors from "cors";
import path from "path";

// dotenv config
dotenv.config();

// db config
connectDB();

// app config
const app = express();

// middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "./client/build")))

app.use('*', function(req, res){
  res.sendFile(path.join(__dirname, "./client/build/index.html"))
})

// routes
app.use("/api/v1/auth", authRoutes);
// category routes
app.use("/api/v1/category", categoryRoutes);
// product routes 
app.use("/api/v1/product", productRoutes);
// user routes 
app.use("/api/v1/user", userRoutes);

// rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to my E-Commerce Website</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.DEV_MODE} mode on port ${PORT}`
  );
});
