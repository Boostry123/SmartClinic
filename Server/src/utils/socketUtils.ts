import { Server } from "socket.io";

export const emitCacheInvalidation = (io: Server, type: "appointments" | "patients" | "treatments" = "appointments") => {
  if (io) {
    io.emit("cacheInvalidation", { type });
  }
};
