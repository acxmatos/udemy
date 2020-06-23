import express from "express";
import "express-async-errors"; // enables async error throwing without calling next
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

// Express
const app = express();
app.set("trust proxy", true); // trusts nginx proxy coming through ingress

// Middlewares - Packages/Builtins
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true, // cookies only over https
  })
);

// Middlewares - Custom
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Handles any invalid route not found in any
// of the router handlers set above
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

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
