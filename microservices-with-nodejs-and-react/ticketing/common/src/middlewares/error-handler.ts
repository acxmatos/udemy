import { Request, Response, NextFunction } from "express";

import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // console.error(err.toString());

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }

  res.status(500).send({
    errors: [
      {
        message: "Something went wrong",
      },
    ],
  });
};
