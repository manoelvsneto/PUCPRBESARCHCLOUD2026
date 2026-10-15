import type { Todo } from "../../domain/entities/Todo.js";

export interface TodoRepository {
  save(todo: Todo): Promise<void>;
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  delete(id: string): Promise<void>;
}
