import React, { useRef, useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllUsersId } from "../../services/api";

import {
  connectUserSocket,
  sendMessageToAdmin,
} from "../../SOCKET/User.socket";
import {
  connectAdminSocket,
  sendMessageToUser,
} from "../../SOCKET/Admin.socket";

interface ChatPageProps {
  isManager: boolean;
}

interface ChatMessage {
  text: string;
  isMine: boolean;
  userId?: number;
}

export default function Chat({ isManager }: ChatPageProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [userMessages, setUserMessages] = useState<ChatMessage[]>([]);
  const [managerChats, setManagerChats] = useState<{
    [userId: number]: ChatMessage[];
  }>({});
  const [activeUser, setActiveUser] = useState<number | null>(null);

  useEffect(() => {
    if (isManager) {
      const socket = connectAdminSocket();

      //   מסיר listeners קיימים
      socket.off("admin_from_DB");
      socket.off("message_to_admin");
      socket.off("admin_broadcast");

      //  בקשת היסטוריה מה־DB
      socket.emit("request_admin_messages");

      socket.on(
        "admin_from_DB",
        (data: { [userId: number]: ChatMessage[] }) => {
          (async () => {
            const usersId = await getAllUsersId();

            const updatedChats: { [userId: number]: ChatMessage[] } = {
              ...data,
            };

            for (const id of usersId) {
              if (!(id in updatedChats)) {
                updatedChats[id] = [];
              }
            }

            setManagerChats(updatedChats);
          })();
        }
      );

      //  הודעות שמגיעות ממשתמשים בזמן אמת
      socket.on(
        "message_to_admin",
        (data: { userId: number; message: string }) => {
          setManagerChats((prev) => ({
            ...prev,
            [data.userId]: [
              ...(prev[data.userId] || []),
              { text: data.message, isMine: false },
            ],
          }));
        }
      );

      //  הודעות שמגיעות מאדמין אחר בזמן אמת
      socket.on(
        "admin_broadcast",
        (data: { userId: number; message: string }) => {
          setManagerChats((prev) => ({
            ...prev,
            [data.userId]: [
              ...(prev[data.userId] || []),
              { text: data.message, isMine: true },
            ],
          }));
        }
      );

      //  ניקוי listeners כשיש unmount
      return () => {
        socket.off("admin_from_DB");
        socket.off("message_to_admin");
        socket.off("admin_broadcast");
      };
    } else {
      const socket = connectUserSocket();
      const user = localStorage.getItem("user");
      const userId = user ? JSON.parse(user).id : null;

      socket.off("user_from_DB");
      socket.off("message_to_user");

      socket.emit("request_user_messages", userId);

      socket.on("user_from_DB", (data: ChatMessage[]) => {
        setUserMessages(data);
      });

      socket.on("message_to_user", (message: string) => {
        setUserMessages((prev) => [...prev, { text: message, isMine: false }]);
      });

      return () => {
        socket.off("user_from_DB");
        socket.off("message_to_user");
      };
    }
  }, []);

  const handleSend = () => {
    const msg = inputRef.current?.value.trim();
    if (!msg) return;

    if (isManager) {
      if (!activeUser) return;
      sendMessageToUser(msg, activeUser);
      setManagerChats((prev) => ({
        ...prev,
        [activeUser]: [
          ...(prev[activeUser] || []),
          { text: msg, isMine: true },
        ],
      }));
    } else {
      sendMessageToAdmin(msg);
      setUserMessages((prev) => [...prev, { text: msg, isMine: true }]);
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const currentMessages = isManager
    ? activeUser
      ? managerChats[activeUser] || []
      : []
    : userMessages;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* סרגל שמאלי */}
      <Box
        sx={{
          width: isManager ? "120px" : "60px",
          bgcolor: "grey.200",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
          gap: 2,
        }}
      >
        {/* כפתור חזרה לכולם */}
        <Button variant="outlined" onClick={() => navigate("/")}>
          BACK
        </Button>

        {/* רשימת משתמשים - רק למנהל */}
        {isManager &&
          Object.keys(managerChats).map((user) => {
            const userId = Number(user);
            return (
              <Button
                key={user}
                variant={activeUser === userId ? "contained" : "outlined"}
                color={activeUser === userId ? "primary" : "inherit"}
                fullWidth
                onClick={() => setActiveUser(userId)}
              >
                {`User${user}`}
              </Button>
            );
          })}
      </Box>

      {/* חלון הצ'אט */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 3,
          bgcolor: "grey.50",
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mb: 2,
            p: 2,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {!isManager || activeUser ? (
            currentMessages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: msg.isMine ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  sx={{
                    p: 1,
                    bgcolor: msg.isMine ? "primary.light" : "grey.300",
                    maxWidth: "70%",
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    {msg.isMine
                      ? "You"
                      : isManager
                      ? `User${activeUser}`
                      : "Admin"}
                  </Typography>
                  <Typography variant="body1">{msg.text}</Typography>
                </Paper>
              </Box>
            ))
          ) : (
            <Typography color="textSecondary">
              Choose a user to start chatting.
            </Typography>
          )}
        </Box>

        {/* שדה טקסט + כפתור שליחה */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            inputRef={inputRef}
            variant="outlined"
            placeholder="Type your message..."
            disabled={isManager && !activeUser}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={isManager && !activeUser}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
