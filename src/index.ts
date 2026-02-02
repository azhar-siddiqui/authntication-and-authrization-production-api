import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import rateLimit from 'express-rate-limit';
import helmet from "helmet";
import fs from "node:fs";
import {
  createOpenApiExpressMiddleware,
  generateOpenApiDocument,
} from "trpc-to-openapi";

import { createContext } from "./context.js";
import { appRouter } from "./server/index.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(express.json())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                 // limit each IP to 100 requests
  })
)

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
  console.log(`Server is up and running on http://localhost:${PORT}`);
});
