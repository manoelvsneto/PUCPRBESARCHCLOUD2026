import type { ErrorRequestHandler } from "express";
import { TodoNotFoundError } from "../../domain/errors/TodoNotFoundError.js";
import { ValidationError } from "../../domain/errors/ValidationError.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ValidationError) {
    response.status(400).json({ error: error.message });
    return;
  }

  if (error instanceof TodoNotFoundError) {
    response.status(404).json({ error: error.message });
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Internal server error" });
};
