const mongoose = require("mongoose");
const express = require("express");
const user = require("./routes/user");
const auth = require("./routes/auth");
const inventory = require("./routes/inventory");
require("dotenv").config();

const app = express();
dbUrl = process.env.DATABASE_URL;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use("/api/signUp", user);
app.use("/api/login", auth);
app.use("/api/getInventory", inventory);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
