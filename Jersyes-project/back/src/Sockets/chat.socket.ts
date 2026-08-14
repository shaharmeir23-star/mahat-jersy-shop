import { Server, Socket } from "socket.io";
import logger from "../logger/logger";
import {
  addMessage,
  getUserMessages,
  getManagerMessages,
} from "../services/message.service";

interface UserMap {
  [userId: number]: string; 
}

export default async function chatSocket(io: Server) {
  const usersMap: UserMap = {};

  io.on("connection", (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    //  משתמש רגיל פותח צ'אט
    socket.on("user_open_chat", async (userId: number) => {
      usersMap[userId] = socket.id;
      logger.info(`User ${userId} connected with socket ${socket.id}`);
      const data = await getUserMessages(userId);
      socket.emit("user_from_DB", data);
    });

    //  מנהל נכנס 
    socket.on("admin_join", async () => {
      socket.join("admins");
      logger.info(`Admin joined, socket: ${socket.id}`);
      const data = await getManagerMessages();
      socket.emit("admin_from_DB", data);
    });

    socket.on("request_admin_messages", async () => {
      const data = await getManagerMessages();
      socket.emit("admin_from_DB", data);
    });

    socket.on("request_user_messages", async (userId: number) => {
      const data = await getUserMessages(userId);
      socket.emit("user_from_DB", data);
    });

    //  משתמש שולח הודעה למנהלים 
    socket.on("user_message", async ({ userId, message }) => {
      logger.info(`User ${userId} sent: ${message}`);
      io.to("admins").emit("message_to_admin", { userId, message });
      await addMessage({ text: message, senderId: userId });
    });

    //  אדמין שולח הודעה למשתמש 
    socket.on("admin_message", async ({ userId, message }) => {
      const userSocketId = usersMap[userId];

      if (userSocketId) {
        io.to(userSocketId).emit("message_to_user", message);
      }

      socket.to("admins").emit("admin_broadcast", {
        userId,
        message,
      });
      logger.info(`Admin sent message to user ${userId}: ${message}`);

      await addMessage({ text: message, receiverId: userId });
    });

    //  ניתוק 
    socket.on("disconnect", () => {
      logger.info(`Disconnected: ${socket.id}`);

      // מוחק משתמש שהתנתק
      const userId = Object.keys(usersMap).find(
        (key) => usersMap[Number(key)] === socket.id
      );
      if (userId) {
        delete usersMap[Number(userId)];
        logger.info(`User ${userId} removed`);
      }
    });
  });
}
