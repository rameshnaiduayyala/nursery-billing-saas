export default async function healthRoutes(app) {
  app.get("/health", async () => ({
    success: true,
    service: "nursery-api",
    timestamp: new Date().toISOString(),
  }));
}
