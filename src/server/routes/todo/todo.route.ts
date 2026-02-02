import z from "zod";
import { publicProcedure, router } from "../../trpc.js";
import { getAllTodosOutputModel, todoModel, type Todo } from "./models.js";

const todos: Todo[] = [
  {
    id: "a4d932e1-2f6a-4668-9f7c-f3e1b9b71001",
    title: "First Todo",
    description: "This is the first todo item",
    isCompleted: false,
  },
  {
    id: "8469972a-e95c-49ce-8e9f-14f9ef650e2a",
    title: "Second Todo",
    description: "This is the second todo item",
    isCompleted: true,
  },
];

export const todoRouter = router({
  createTodo: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/create-todo",
        tags: ["Todos"],
        summary: "Create a new todo",
      },
    })
    .input(
      z.object({
        title: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
      }),
    )
    .output(
      z.object({
        todo: todoModel,
      }),
    )
    .mutation(({ input }) => {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        isCompleted: false,
        title: input.title,
      };
      todos.push(newTodo);
      return { todo: newTodo };
    }),

  getAllTodos: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/todos",
        tags: ["Todos"],
        summary: "Get all todo",
      },
    })
    .input(z.undefined())
    .output(getAllTodosOutputModel)
    .query(() => {
      return { todos };
    }),
});

// Export type router type signature,
// NOT the router itself.
export type TodoRouter = typeof todoRouter;
