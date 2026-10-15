import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import type { TodoService } from "../../application/services/TodoService.js";
import { errorHandler } from "./errorHandler.js";
import { openApiDocument } from "../openapi.js";
import { createTodoRouter } from "./todoRouter.js";

export function createApp(service: TodoService): Express {
  const app = express();
  app.use(express.json({ limit: "1mb" }));
  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });
  app.get("/api-docs.json", (_request, response) => {
    response.json(openApiDocument);
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use("/api/todos", createTodoRouter(service));
  app.use(errorHandler);
  return app;
}
