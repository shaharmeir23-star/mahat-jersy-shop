import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  Divider,
  Box,
  Chip,
  MenuItem,
  Select,
} from "@mui/material";
import { STATUS_PRIORITY, type Order, type OrderStatus } from "../../Types";
import { getAllOrders, changeStatus } from "../../services/api";

type OrdersProps = {
  isManager: boolean;
};

export default function Orders({ isManager }: OrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")!);
        const ordersResault: Order[] = await getAllOrders(user.id);
        setOrders(ordersResault);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  const sortedOrders = [...orders].sort(
    (a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]
  );

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    await changeStatus(orderId, newStatus);

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => (window.location.href = "/")}
        sx={{ mb: 3 }}
      >
        Back to Home
      </Button>

      <Typography variant="h4" sx={{ mb: 3 }}>
        My Orders
      </Typography>

      {sortedOrders.map((order) => (
        <Card
          key={order.id}
          sx={{
            mb: 2,
            borderRadius: "12px",
            border: "1px solid #ddd",
            backgroundColor: "#fafafa",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Order #{order.id}
            </Typography>
            {isManager ? (
              <Select
                value={order.status}
                size="small"
                sx={{ mb: 2, minWidth: 120 }}
                onChange={(e) =>
                  handleStatusChange(order.id, e.target.value as OrderStatus)
                }
              >
                <MenuItem value="paid" disabled={order.status === "paid"}>
                  paid
                </MenuItem>
                <MenuItem value="sent" disabled={order.status === "sent"}>
                  sent
                </MenuItem>
                <MenuItem value="arrived" disabled={order.status === "arrived"}>
                  arrived
                </MenuItem>
              </Select>
            ) : (
              <Chip label={order.status} color="info" sx={{ mb: 2 }} />
            )}

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Products:
            </Typography>

            <List>
              {order.items.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingLeft: 0,
                  }}
                >
                  <Typography>{item.name}</Typography>
                  <Typography>×{item.amount}</Typography>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
