const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cors = require("cors");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.get("/api/test", async (req, res) => {
  console.log("test is successfull!");
  res.status(200).json("test is successfull!");
});
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

// New routes
app.use("/api/products", productRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
