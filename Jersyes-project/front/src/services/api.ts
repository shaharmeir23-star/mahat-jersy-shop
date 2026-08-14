import type { loginRes, cart, Order } from "../Types";

const BASE_URL = "http://localhost:3000";

const request = async (
  url: string,
  method: string,
  body?: unknown,
  token?: string
) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && typeof body === "object") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(BASE_URL + url, options);

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`${err.errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:" + error);
    throw error;
  }
};

const signUp = async (userData: {
  email: string;
  password: string;
  userName: string;
}) => {
  return await request("/users/signUp", "POST", userData);
};

const logIn = async (userData: {
  email: string;
  password: string;
  userName: string;
}): Promise<loginRes> => {
  return await request("/users/logIn", "POST", userData);
};

const getAllProducts = async () => {
  const token = localStorage.getItem("jwtToken") ?? undefined;
  return await request("/products", "GET", undefined, token);
};

const addToCart = async (cartId: number, productId: number, amount: number) => {
  const token = localStorage.getItem("jwtToken") ?? undefined;
  return await request(
    `/orderItems/cart/add/${amount}`,
    "POST",
    { cartId, productId },
    token
  );
};

const removeFromCart = async (cartId: number, productId: number) => {
  const token = localStorage.getItem("jwtToken") ?? undefined;
  return await request(
    "/orderItems/cart/remove",
    "DELETE",
    { cartId, productId },
    token
  );
};

const getCart = async (userId: string) => {
  const token = localStorage.getItem("jwtToken") ?? undefined;
  return await request(`/order/cart/${userId}`, "GET", undefined, token);
};

const submitCart = async (
  cartId: number,
  newStatus: string,
  userId: number
): Promise<cart> => {
  const token = localStorage.getItem("jwtToken") ?? undefined;
  return await request(
    "/order/submit/cart",
    "PATCH",
    {
      orderId: cartId,
      newStatus,
      userId,
    },
    token
  );
};

const changeStatus = async (
  cartId: number,
  newStatus: string
): Promise<cart> => {
  const token = localStorage.getItem("jwtToken") ?? undefined;
  return await request(
    "/order/status",
    "PATCH",
    {
      orderId: cartId,
      newStatus,
    },
    token
  );
};

const getAllOrders = async (userId: number): Promise<Order[]> => {
  const token = localStorage.getItem("jwtToken") ?? undefined;
  return await request(`/order/allOrders/${userId}`, "GET", undefined, token);
};

const deleteJersey = async (productId: number) => {
  const token = localStorage.getItem("jwtToken") ?? undefined;
  return await request(
    `/products/delete/${productId.toString()}`,
    "DELETE",
    undefined,
    token
  );
};

const updateJesey = async (
  productId: number,
  name: string,
  price: number,
  imageUrl: string
): Promise<string> => {
  const token = localStorage.getItem("jwtToken") ?? undefined;
  return await request(
    `/products/update/${productId}`,
    "PUT",
    {
      name,
      price,
      imageUrl,
    },
    token
  );
};

const getAllUsersId = async () => {
  const token = localStorage.getItem("jwtToken") ?? undefined;
  return await request("/users/id", "GET", undefined, token);
};

const updateProfile = async (
  userId: number,
  userName: string,
  email: string
) => {
  const token = localStorage.getItem("jwtToken") ?? undefined;
  return await request(
    `/users/update/${userId}`,
    "PUT",
    {
      userName,
      email,
    },
    token
  );
};

const updatePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  const token = localStorage.getItem("jwtToken") ?? undefined;
  return await request(
    `/users/update/password/${userId}`,
    "PUT",
    {
      currentPassword,
      newPassword,
    },
    token
  );
};

const addJerseyRequest = async (formData: FormData) => {
  const token = localStorage.getItem("jwtToken");

  try {
    const response = await fetch(`${BASE_URL}/products/add`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.errorMessage || "Failed to add jersey");
    }

    return await response.json();
  } catch (error) {
    console.error("Add Jersey Error:", error);
    throw error;
  }
};

export {
  signUp,
  logIn,
  getAllProducts,
  addToCart,
  removeFromCart,
  getCart,
  submitCart,
  getAllOrders,
  addJerseyRequest,
  deleteJersey,
  changeStatus,
  getAllUsersId,
  updateJesey,
  updateProfile,
  updatePassword,
};
