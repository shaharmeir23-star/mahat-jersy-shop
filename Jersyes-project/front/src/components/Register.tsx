import { Box, Button, TextField, Typography, Paper } from "@mui/material";

export default function Register({
  title,
  fields,
  submitLabel,
  onSubmit,
  extraButton,
}: {
  title: string;
  fields: {
    name: string;
    label: string;
    type?: string;
    defaultValue?: string | number;
    disabeld?: boolean;
  }[];
  submitLabel: string;
  onSubmit: (formData: FormData) => void;
  extraButton?: React.ReactNode;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onSubmit(data);
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
        sx={{
          padding: "40px",
          width: "350px",
          textAlign: "center",
          borderRadius: "12px",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={3}>
          {title}
        </Typography>

        <form onSubmit={handleSubmit}>
          {fields.map((f) => (
            <TextField
              key={f.name}
              label={f.label}
              name={f.name}
              type={f.type || "text"}
              defaultValue={f.defaultValue}
              disabled={f.disabeld ? f.disabeld : false}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
          ))}

          <Button type="submit" variant="contained" fullWidth size="large">
            {submitLabel}
          </Button>

          {extraButton && <Box mt={2}>{extraButton}</Box>}
        </form>
      </Paper>
    </Box>
  );
}
