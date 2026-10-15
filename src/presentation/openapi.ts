export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Todo API",
    version: "1.0.0",
    description: "API REST para gerenciamento de tarefas",
  },
  servers: [{ url: "/" }],
  paths: {
    "/api/todos": {
      get: {
        summary: "Lista todas as tarefas",
        responses: {
          "200": {
            description: "Lista de tarefas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Todo" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Cria uma tarefa",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTodo" },
            },
          },
        },
        responses: {
          "201": {
            description: "Tarefa criada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Todo" },
              },
            },
          },
          "400": { description: "Dados invalidos" },
        },
      },
    },
    "/api/todos/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      get: {
        summary: "Busca uma tarefa",
        responses: {
          "200": {
            description: "Tarefa encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Todo" },
              },
            },
          },
          "404": { description: "Tarefa nao encontrada" },
        },
      },
      patch: {
        summary: "Atualiza uma tarefa",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTodo" },
            },
          },
        },
        responses: {
          "200": {
            description: "Tarefa atualizada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Todo" },
              },
            },
          },
          "400": { description: "Dados invalidos" },
          "404": { description: "Tarefa nao encontrada" },
        },
      },
      delete: {
        summary: "Remove uma tarefa",
        responses: {
          "204": { description: "Tarefa removida" },
          "404": { description: "Tarefa nao encontrada" },
        },
      },
    },
  },
  components: {
    schemas: {
      Todo: {
        type: "object",
        required: ["id", "title", "description", "completed", "createdAt", "updatedAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          description: { type: "string" },
          completed: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateTodo: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", minLength: 1 },
          description: { type: "string" },
        },
      },
      UpdateTodo: {
        type: "object",
        properties: {
          title: { type: "string", minLength: 1 },
          description: { type: "string" },
          completed: { type: "boolean" },
        },
      },
    },
  },
};
