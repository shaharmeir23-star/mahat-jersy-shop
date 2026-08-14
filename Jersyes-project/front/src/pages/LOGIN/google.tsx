import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { CartItem } from "../../Types";

export default function LoginSuccess({
  onLogin,
  setCartItems,
}: {
  onLogin: () => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    const id = params.get("id");
    const userName = params.get("userName");
    const email = params.get("email");
    const isManager = params.get("isManager");
    const cartJSON = params.get("cart");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    localStorage.setItem("jwtToken", token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        id,
        userName,
        email,
        isManager: isManager === "true",
      })
    );

    if (cartJSON) {
      const cart = JSON.parse(cartJSON);
      localStorage.setItem("cartId", cart.id.toString());
      setCartItems(cart.items);
    }

    onLogin();
    navigate("/", { replace: true });
  }, [location.search, navigate, onLogin, setCartItems]);

  return <div>Logging in...</div>;
}
