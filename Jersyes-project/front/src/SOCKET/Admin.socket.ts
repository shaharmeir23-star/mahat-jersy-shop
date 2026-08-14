import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectAdminSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log(`Admin connected: ${socket?.id}`, socket?.id);
      socket?.emit("admin_join");
    });
  }
  
  return socket;
};

export const sendMessageToUser = (message: string, userId: number) => {
  if (!socket) return;
  socket.emit("admin_message", { userId, message });
};

