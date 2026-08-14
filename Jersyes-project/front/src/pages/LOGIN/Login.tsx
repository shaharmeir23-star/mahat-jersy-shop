import React from "react";
import { Button, Box } from "@mui/material";
import Register from "../../components/Register";
import { useNavigate } from "react-router-dom";
import { logIn } from "../../services/api";
import type { CartItem } from "../../Types";

export default function Login({
  onLogin,
  setCartItems,
}: {
  onLogin: () => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}) {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    const userName = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const loginRes = await logIn({
        email: String(email),
        password: String(password),
        userName: String(userName),
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          userName,
          email,
          id: loginRes.id,
          isManager: loginRes.isManager,
        })
      );
      localStorage.setItem("jwtToken", loginRes.token);
      localStorage.setItem("cartId", loginRes.cart.id.toString());
      setCartItems(loginRes.cart.items);

      onLogin();
      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert("log in Error: " + message);
    }
  };

  const handleGoogleButton = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <Register
      
      title="Login"
      submitLabel="Log In"
      fields={[
        { name: "username", label: "Username" },
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: "Password", type: "password" },
      ]}
      onSubmit={handleSubmit}
      extraButton={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            size="medium"
            sx={{
              width: "50%",
              mx: "auto",
              display: "block",
            }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>

          {/* כפתור התחברות עם גוגל */}
          <Button
            variant="outlined"
            size="medium"
            sx={{
              width: "50%",
              mx: "auto",
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "white",
              borderColor: "#dadce0",
              color: "black",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#f7f7f7",
                borderColor: "#c6c6c6",
              },
            }}
            onClick={handleGoogleButton}
          >
            Login with Google
          </Button>
        </Box>
      }
    />
  );
}
