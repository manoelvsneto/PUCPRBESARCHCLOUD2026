import { randomUUID } from "node:crypto";
import { Todo, type TodoUpdates } from "../../domain/entities/Todo.js";
import { TodoNotFoundError } from "../../domain/errors/TodoNotFoundError.js";
import type { TodoRepository } from "../ports/TodoRepository.js";

export class TodoService {
  constructor(
    private readonly repository: TodoRepository,
    private readonly createId: () => string = randomUUID,
    private readonly now: () => string = () => new Date().toISOString(),
  ) {}

  async create(input: TodoUpdates): Promise<Todo> {
    const todo = Todo.create(input, this.createId(), this.now());
    await this.repository.save(todo);
    return todo;
  }

  list(): Promise<Todo[]> {
    return this.repository.findAll();
  }

  async get(id: string): Promise<Todo> {
    const todo = await this.repository.findById(id);
    if (!todo) {
      throw new TodoNotFoundError(id);
    }
    return todo;
  }

  async update(id: string, input: TodoUpdates): Promise<Todo> {
    const todo = await this.get(id);
    const updatedTodo = todo.update(input, this.now());
    await this.repository.save(updatedTodo);
    return updatedTodo;
  }

  async delete(id: string): Promise<void> {
    await this.get(id);
    await this.repository.delete(id);
  }
}
