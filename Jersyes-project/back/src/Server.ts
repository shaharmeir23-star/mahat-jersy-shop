import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { myDataSource } from "./connection/data-source";
import logger from "./logger/logger";
import chatSocket from "./Sockets/chat.socket";

myDataSource
  .initialize()
  .then(async () => {
    const port = 3000;

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: { origin: "*" },
    });

    chatSocket(io);

    server.listen(port, () => {
      logger.info(`Server started on port: ${port}`);
    });
  })
  .catch((error) => logger.error(error));
