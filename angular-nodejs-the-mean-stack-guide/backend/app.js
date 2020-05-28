const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

fs.readFile("mongo_credentials.txt", "utf8", (err, mongoAuthData) => {
  if (err) {
    console.error(
      "Unable to open mongo credentials file. Impossible to continue!"
    );
    process.exit(1);
  }

  // Remove newlines
  mongoAuthData = mongoAuthData.replace(/\r?\n|\r/g, "");

  const cnn = `mongodb+srv://${mongoAuthData}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_DATABASE}?w=majority`;

  console.log(cnn);

  mongoose
    .connect(cnn, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch(() => {
      console.error("Connection failed!");
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
