import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectUserSocket = () => {
  if (!socket) {
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null;

    socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("User connected:", socket?.id);
      socket?.emit("user_open_chat", userId);
    });
  }

  return socket;
};

export const sendMessageToAdmin = (message: string) => {
  if (!socket) return;
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;
  socket.emit("user_message", { userId, message });
};
