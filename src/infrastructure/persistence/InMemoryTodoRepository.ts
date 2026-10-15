import type { TodoRepository } from "../../application/ports/TodoRepository.js";
import type { Todo } from "../../domain/entities/Todo.js";

export class InMemoryTodoRepository implements TodoRepository {
  private readonly todos = new Map<string, Todo>();

  async save(todo: Todo): Promise<void> {
    this.todos.set(todo.id, todo);
  }

  async findAll(): Promise<Todo[]> {
    return [...this.todos.values()];
  }

  async findById(id: string): Promise<Todo | null> {
    return this.todos.get(id) ?? null;
  }

  async delete(id: string): Promise<void> {
    this.todos.delete(id);
  }
}
