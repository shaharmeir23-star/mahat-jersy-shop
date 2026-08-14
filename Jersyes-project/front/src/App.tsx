import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/HOME/Home";
import Login from "./pages/LOGIN/Login";
import SignUp from "./pages/SIGNUP/Signup";
import Cart from "./pages/CART/Cart";
import ORDERS from "./pages/ORDERS/Orders";
import LoginSuccess from "./pages/LOGIN/google";
import AddProduct from "./pages/ADD_PRODUCT/AddProduct";
import PROFILE from "./pages/PROFILE/Profile";
import CHAT from "./pages/CHAT/Chat";
import type { CartItem } from "./Types";

export default function App() {
  const storedUser = localStorage.getItem("user");
  const initialLoginState = storedUser ? true : false;
  const initialIsManager = storedUser
    ? JSON.parse(storedUser).isManager === true
    : false;

  const [isManager, setIsManager] = useState<boolean>(initialIsManager);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initialLoginState);

  const onLogin = () => {
    setIsLoggedIn(true);

    const userString = localStorage.getItem("user");
    if (userString) {
      const storedUser = JSON.parse(userString);
      setIsManager(storedUser.isManager === true);
    } else {
      setIsManager(false); // ברירת מחדל אם אין משתמש
    }
  };
 

  return (
    <Router>
      <Routes>
        {/* עמוד הבית: רק למשתמשים מחוברים */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Home
                onLogout={() => setIsLoggedIn(false)}
                cartItems={cartItems}
                setCartItems={setCartItems}
                isManager={isManager}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* עמוד התחברות */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={onLogin} setCartItems={setCartItems} />
            )
          }
        />

        {/* עמוד ההתחברות עם גוגל */}
        <Route
          path="/loginSuccess"
          element={
            <LoginSuccess onLogin={onLogin} setCartItems={setCartItems} />
          }
        />

        {/* עמוד הרשמה */}
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/" replace /> : <SignUp />}
        />

        {/* עמוד עגלה */}
        <Route
          path="/cart"
          element={
            isLoggedIn ? (
              <Cart cartItems={cartItems} setCartItems={setCartItems} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* עמוד הזמנות */}
        <Route
          path="/orders"
          element={
            isLoggedIn ? (
              <ORDERS isManager={isManager} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* עמוד צאט */}
        <Route
          path="/chat"
          element={
            isLoggedIn ? (
              <CHAT isManager={isManager} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* עמוד הוספת מוצר */}
        <Route
          path="/add-product"
          element={
            !isLoggedIn ? (
              <Navigate to="/login" replace />
            ) : !isManager ? (
              <Navigate to="/" replace />
            ) : (
              <AddProduct />
            )
          }
        />

        {/* עמוד עריכת פרופיל */}
        <Route
          path="/profile"
          element={isLoggedIn ? <PROFILE /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}
