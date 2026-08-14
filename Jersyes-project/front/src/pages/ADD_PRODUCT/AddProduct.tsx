import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addJerseyRequest } from "../../services/api";
export default function AddJersey() {
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData();

    // מקבל את הערכים מהשדות
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const price = (form.elements.namedItem("price") as HTMLInputElement).value;
    const imageInput = form.elements.namedItem("image") as HTMLInputElement;

    const file = imageInput.files?.[0] || null;

    // מוסיף ל-FormData
    formData.append("name", name);
    formData.append("price", price);

    if (file) {
      formData.append("image", file);
    }

    await addJerseyRequest(formData);
    navigate("/");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper
        elevation={4}
        sx={{ padding: "40px", width: "350px", borderRadius: "12px" }}
      >
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mb: 3 }}
          onClick={() => navigate("/")}
        >
          Back
        </Button>

        <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
          Add Jersey
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Jersey Name"
            name="name"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{
              mb: 3,
              bgcolor: "green",
              "&:hover": { bgcolor: "darkgreen" },
            }}
          >
            Choose Image
            <input
              type="file"
              name="image"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          {selectedFileName && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Selected file: {selectedFileName}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{
              height: "64px",
              width: "50%",
              fontSize: "1.2rem",
              display: "block",
              mx: "auto",
            }}
          >
            Add Jersey
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
