const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { createServer } = require("node:http");
const { createApp } = require("../dist/presentation/http/app.js");
const { TodoService } = require("../dist/application/services/TodoService.js");
const { InMemoryTodoRepository } = require("../dist/infrastructure/persistence/InMemoryTodoRepository.js");

const server = createServer(
  createApp(new TodoService(new InMemoryTodoRepository())),
);
let baseUrl;

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

test("supports the complete todo CRUD lifecycle", async () => {
  const createResponse = await fetch(`${baseUrl}/api/todos`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: "  Buy milk  ", description: "  Oat milk " }),
  });
  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();
  assert.equal(created.title, "Buy milk");
  assert.equal(created.description, "Oat milk");
  assert.equal(created.completed, false);

  const listResponse = await fetch(`${baseUrl}/api/todos`);
  assert.equal(listResponse.status, 200);
  assert.deepEqual(await listResponse.json(), [created]);

  const getResponse = await fetch(`${baseUrl}/api/todos/${created.id}`);
  assert.equal(getResponse.status, 200);
  assert.deepEqual(await getResponse.json(), created);

  const updateResponse = await fetch(`${baseUrl}/api/todos/${created.id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ completed: true }),
  });
  assert.equal(updateResponse.status, 200);
  const updated = await updateResponse.json();
  assert.equal(updated.completed, true);
  assert.equal(updated.title, created.title);

  const deleteResponse = await fetch(`${baseUrl}/api/todos/${created.id}`, {
    method: "DELETE",
  });
  assert.equal(deleteResponse.status, 204);

  const missingResponse = await fetch(`${baseUrl}/api/todos/${created.id}`);
  assert.equal(missingResponse.status, 404);
});

test("validates input and serves the OpenAPI document", async () => {
  const invalidResponse = await fetch(`${baseUrl}/api/todos`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: "   " }),
  });
  assert.equal(invalidResponse.status, 400);

  const docsResponse = await fetch(`${baseUrl}/api-docs.json`);
  assert.equal(docsResponse.status, 200);
  const document = await docsResponse.json();
  assert.equal(document.openapi, "3.0.3");
  assert.ok(document.paths["/api/todos/{id}"].delete);

  const swaggerResponse = await fetch(`${baseUrl}/api-docs`);
  assert.equal(swaggerResponse.status, 200);
  assert.match(swaggerResponse.headers.get("content-type"), /text\/html/);
  assert.match(await swaggerResponse.text(), /id="swagger-ui"/);
});
