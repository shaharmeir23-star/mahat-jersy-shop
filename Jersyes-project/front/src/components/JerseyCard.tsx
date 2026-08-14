import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import type { Jersey } from "../Types";

interface JerseyCardProps<T extends Jersey> {
  jersey: T;
  children?: React.ReactNode;
}

export default function JerseyCard<T extends Jersey>({
  jersey,
  children,
}: JerseyCardProps<T>) {
  return (
    <Card sx={{ width: 345 }}>
      <CardMedia
        component="img"
        height="240"
        image={jersey.imageUrl}
        alt={jersey.name}
      />
      <CardContent>
        <Typography variant="h6">{jersey.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          ${jersey.price}
        </Typography>

        {"amount" in jersey && (
          <Typography variant="body2" color="text.secondary">
            {`amount: ${jersey.amount}`}
          </Typography>
        )}

        {children}
      </CardContent>
    </Card>
  );
}
