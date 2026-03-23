import { Router } from "express";

const healthCheckRoutes = Router();
//Basic healthcheck for pinging the server to check if it's alive
healthCheckRoutes.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default healthCheckRoutes;
