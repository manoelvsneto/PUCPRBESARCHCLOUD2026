import { ValidationError } from "../errors/ValidationError.js";

export interface TodoProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoUpdates {
  title?: unknown;
  description?: unknown;
  completed?: unknown;
}

export class Todo {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(props: TodoProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.completed = props.completed;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(input: TodoUpdates, id: string, now: string): Todo {
    return new Todo({
      id,
      title: validateTitle(input.title),
      description: validateDescription(input.description ?? ""),
      completed: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  update(input: TodoUpdates, now: string): Todo {
    if (Object.keys(input).length === 0) {
      throw new ValidationError("At least one field must be provided");
    }

    return new Todo({
      id: this.id,
      title: input.title === undefined ? this.title : validateTitle(input.title),
      description:
        input.description === undefined
          ? this.description
          : validateDescription(input.description),
      completed:
        input.completed === undefined
          ? this.completed
          : validateCompleted(input.completed),
      createdAt: this.createdAt,
      updatedAt: now,
    });
  }
}

function validateTitle(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError("title must be a non-empty string");
  }
  return value.trim();
}

function validateDescription(value: unknown): string {
  if (typeof value !== "string") {
    throw new ValidationError("description must be a string");
  }
  return value.trim();
}

function validateCompleted(value: unknown): boolean {
  if (typeof value !== "boolean") {
    throw new ValidationError("completed must be a boolean");
  }
  return value;
}
