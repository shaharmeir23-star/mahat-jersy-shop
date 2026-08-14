import React from "react";
import { useEffect } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import JerseyCard from "../../components/JerseyCard";
import type { CartItem } from "../../Types";
import { getCart, submitCart } from "../../services/api";

export interface CartPageProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function Cart({ cartItems, setCartItems }: CartPageProps) {
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (sum, jersey) => sum + jersey.price * jersey.amount,
    0,
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")!);
        const cart = await getCart(user.id);
        const cartItems = cart.items;
        setCartItems(cartItems);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user")!);
    const userId = user.id;
    const cartId = Number(localStorage.getItem("cartId"));
    const newCart = await submitCart(cartId, "paid", userId);
    localStorage.setItem("cartId", newCart.id.toString());
    setCartItems(newCart.items);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Your Cart
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSubmit}>
          Submit Order
        </Button>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Total Price: ${totalPrice}
      </Typography>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "24px",
          marginTop: "16px",
        }}
      >
        {cartItems.map((jersey) => (
          <JerseyCard key={jersey.id} jersey={jersey} />
        ))}
      </div>
    </Container>
  );
}
