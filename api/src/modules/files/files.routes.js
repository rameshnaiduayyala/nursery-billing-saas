import {
  listFiles,
  registerFile,
  getFileById,
  deleteFile,
} from "./files.controller.js";

export default async function fileRoutes(app) {
  app.get("/files", listFiles);
  app.post("/files", registerFile);
  app.get("/files/:id", getFileById);
  app.delete("/files/:id", deleteFile);
}
