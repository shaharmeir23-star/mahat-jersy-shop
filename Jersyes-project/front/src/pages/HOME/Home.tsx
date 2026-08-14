import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box, TextField } from "@mui/material";
import JerseyCard from "../../components/JerseyCard";
import type { Jersey, CartItem } from "../../Types";
import {
  addToCart,
  getAllProducts,
  removeFromCart,
  getCart,
  deleteJersey,
} from "../../services/api";
import EditJerseyModal from "../../components/EditJerseyModal";

type HomeProps = {
  onLogout: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isManager: boolean;
};

export default function Home({
  onLogout,
  cartItems,
  setCartItems,
  isManager,
}: HomeProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Jersey[]>([]);
  const [search, setSearch] = useState<string>("");
  const amountRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const [filterBy, setFilterBy] = useState<string>("newest");
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedJersey, setSelectedJersey] = useState<Jersey | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
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

  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("cartId");
    onLogout();
  };

  const toggleCartItem = (jersey: Jersey) => {
    if (cartItems.some((item) => item.id === jersey.id)) {
      removeFromCart(Number(localStorage.getItem("cartId")), jersey.id);
      setCartItems((prev) => prev.filter((item) => item.id !== jersey.id));
    } else {
      const amount = Number(amountRefs.current[jersey.id]?.value || 1);
      addToCart(Number(localStorage.getItem("cartId")), jersey.id, amount);
      setCartItems((prev) => [...prev, { ...jersey, amount }]);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    await deleteJersey(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleOpenEdit = (j: Jersey) => {
    setSelectedJersey(j);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedJersey(null);
  };

  let filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // APPLY SORTING
  if (filterBy === "newest") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.id - a.id);
  }

  if (filterBy === "az") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  if (filterBy === "high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  if (filterBy === "low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  }

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
      <Typography
        variant="h4"
        fontWeight="900"
        gutterBottom
        textAlign="center"
        sx={{
          background: "linear-gradient(90deg, #ff6b00, #ff004c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "1px",
          textShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        Shahar's Basketball Jerseys Store
      </Typography>

      <Typography
        variant="subtitle1"
        textAlign="center"
        sx={{
          color: "gray",
          fontStyle: "italic",
          opacity: 0.9,
        }}
      >
        Choose your favorite jersey and start shopping!
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "900px",
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          color="info"
          onClick={() => navigate("/profile")}
        >
          Profile
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/orders")}
        >
          Orders
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/cart")}
        >
          {`(${cartItems.length}) Cart`}
        </Button>

        {isManager && (
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/add-product")}
          >
            Add Product
          </Button>
        )}

        <Button
          onClick={() => navigate("/chat")}
          variant="contained"
          color="warning"
        >
          {isManager ? "CHATS" : "CHAT WITH MANAGER"}
        </Button>

        <Button onClick={handleLogOut} variant="outlined" color="error">
          Log Out
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "900px",
          mb: 2,
        }}
      >
        {/* SEARCH */}
        <TextField
          fullWidth
          label="Search jerseys..."
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FILTER BY */}
        <Box sx={{ ml: 2, width: "200px" }}>
          <TextField
            select
            label="Filter By"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="newest">Newest</option>
            <option value="az">A - Z</option>
            <option value="high">Price: High → Low</option>
            <option value="low">Price: Low → High</option>
          </TextField>
        </Box>
      </Box>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "24px",
          marginTop: "16px",
        }}
      >
        {/* PUT THE PRODUCTS*/}
        {filteredProducts.map((jersey) => {
          const inCart = cartItems.some((item) => item.id === jersey.id);

          return (
            <JerseyCard key={jersey.id} jersey={jersey}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  mb: 1,
                }}
              >
                {isManager && (
                  <>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteProduct(jersey.id)}
                    >
                      Delete Jersey
                    </Button>

                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      onClick={() => handleOpenEdit(jersey)}
                      sx={{ ml: 1 }}
                    >
                      Edit
                    </Button>
                  </>
                )}

                <TextField
                  type="number"
                  label="Qty"
                  size="small"
                  defaultValue={1}
                  inputRef={(el) => (amountRefs.current[jersey.id] = el)}
                  disabled={inCart}
                  inputProps={{ min: 1 }}
                  sx={{ width: "70px" }}
                />
              </Box>

              <Button
                onClick={() => toggleCartItem(jersey)}
                variant="contained"
                color={inCart ? "secondary" : "primary"}
                fullWidth
              >
                {inCart ? "Remove from Cart" : "Add to Cart"}
              </Button>
            </JerseyCard>
          );
        })}
      </div>

      <EditJerseyModal
        open={openEdit}
        onClose={handleCloseEdit}
        jersey={selectedJersey}
        onSave={(updated) => {
          setProducts((prev) =>
            prev.map((j) => (j.id === updated.id ? updated : j))
          );
        }}
      />
    </Container>
  );
}
