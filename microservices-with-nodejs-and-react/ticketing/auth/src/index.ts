import mongoose from "mongoose";

import { app } from "./app";

// Created a separated function to use async/await in old versions of Node
// New versions allow to use await on a top level (no need to use a function)
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("v1");
    console.log("Listening on port 3000");
  });
};

start();
