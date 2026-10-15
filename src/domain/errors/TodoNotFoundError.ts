export class TodoNotFoundError extends Error {
  constructor(id: string) {
    super(`Todo with id "${id}" was not found`);
    this.name = "TodoNotFoundError";
  }
}
