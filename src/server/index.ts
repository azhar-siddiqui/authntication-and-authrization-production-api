import { todoRouter } from "./routes/todo/todo.route.js";
import { router } from "./trpc.js";

// Example of creating the main root application router
export const appRouter = router({
  todos: todoRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
