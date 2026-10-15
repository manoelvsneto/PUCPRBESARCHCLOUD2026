import { createServer } from "node:http";
import { TodoService } from "./application/services/TodoService.js";
import { InMemoryTodoRepository } from "./infrastructure/persistence/InMemoryTodoRepository.js";
import { createApp } from "./presentation/http/app.js";

const port = Number(process.env.PORT ?? 3000);
const app = createApp(new TodoService(new InMemoryTodoRepository()));
const server = createServer(app);

server.listen(port, "0.0.0.0", () => {
  console.log(`Todo API listening on port ${port}`);
});

function shutdown(): void {
  server.close((error) => {
    if (error) {
      console.error("Failed to close HTTP server", error);
      process.exitCode = 1;
    }
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
