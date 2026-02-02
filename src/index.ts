import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import {
  createOpenApiExpressMiddleware,
  generateOpenApiDocument,
} from "trpc-to-openapi";

import fs from "node:fs";

import { createContext } from "./context.js";
import { appRouter } from "./server/index.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(helmet());
app.use(cors());

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "My API todos Documentation",
  version: "1.0.0",
  baseUrl: `http://localhost:${PORT}/api`,
  docsUrl: "/docs",
});

fs.writeFile(
  "./openapi-specification.json",
  JSON.stringify(openApiDocument, null, 2),
  (err) => {
    if (err) {
      console.error("Error writing OpenAPI document to file:", err);
    } else {
      console.log("OpenAPI document successfully written to openapi.json");
    }
  },
);

app.get("/openapi.json", (req, res) => {
  res.json(openApiDocument);
});

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.listen(PORT, () => {
  console.log(`Server is up running on http://localhost:${PORT}`);
});
