import { Router } from "express";
import type { TodoService } from "../../application/services/TodoService.js";
import { asyncHandler } from "./asyncHandler.js";

export function createTodoRouter(service: TodoService): Router {
  const router = Router();

  router.post(
    "/",
    asyncHandler(async (request, response) => {
      const todo = await service.create(request.body ?? {});
      response.status(201).json(todo);
    }),
  );

  router.get(
    "/",
    asyncHandler(async (_request, response) => {
      response.json(await service.list());
    }),
  );

  router.get(
    "/:id",
    asyncHandler(async (request, response) => {
      response.json(await service.get(request.params.id));
    }),
  );

  router.patch(
    "/:id",
    asyncHandler(async (request, response) => {
      response.json(await service.update(request.params.id, request.body ?? {}));
    }),
  );

  router.delete(
    "/:id",
    asyncHandler(async (request, response) => {
      await service.delete(request.params.id);
      response.status(204).end();
    }),
  );

  return router;
}
