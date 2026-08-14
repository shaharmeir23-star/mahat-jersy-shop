import { useRef } from "react";
import {
  Modal,
  Paper,
  Typography,
  TextField,
  Box,
  Button,
} from "@mui/material";
import type { Jersey } from "../Types";
import { updateJesey } from "../services/api";

interface EditJerseyModalProps {
  open: boolean;
  onClose: () => void;
  jersey: Jersey | null;
  onSave: (jersey: Jersey) => void;
}

export default function EditJerseyModal({
  open,
  onClose,
  jersey,
  onSave,
}: EditJerseyModalProps) {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);

  const handleSave = async () => {
    if (!jersey) return;

    await updateJesey(
      jersey.id,
      nameRef.current?.value ?? jersey.name,
      Number(priceRef.current?.value ?? jersey.price),
      jersey.imageUrl
    );
    onSave({
      id: jersey.id,
      name: nameRef.current?.value ?? jersey.name,
      price: Number(priceRef.current?.value ?? jersey.price),
      imageUrl: jersey.imageUrl,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 350,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" textAlign="center">
          Edit Jersey
        </Typography>

        <TextField
          label="Name"
          defaultValue={jersey?.name ?? ""}
          inputRef={(el: HTMLInputElement | null) => {
            nameRef.current = el;
          }}
          fullWidth
        />

        <TextField
          label="Price"
          type="number"
          defaultValue={jersey?.price ?? ""}
          inputRef={(el: HTMLInputElement | null) => {
            priceRef.current = el;
          }}
          fullWidth
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
}
