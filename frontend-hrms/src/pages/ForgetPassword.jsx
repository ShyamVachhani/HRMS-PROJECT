import React, { useState } from "react";
import { Container, Box, TextField, Button, Typography } from "@mui/material";

const ForgetPassword = ({ goToLogin }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }
    alert("Password reset link sent to your email!");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          backgroundColor: "white",
          p: 4,
          borderRadius: 3,
          boxShadow: 5,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ color: "#1E3A8A", fontWeight: "bold" }}>
          Reset Your Password 🔐
        </Typography>

        <Typography sx={{ color: "#3B82F6", mb: 3 }}>
          Enter your registered email to receive reset password
        </Typography>

        <TextField
          label="Email Address"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#1E3A8A",
            "&:hover": { backgroundColor: "#3B82F6" },
          }}
          onClick={handleSubmit}
        >
          Send Reset Link
        </Button>

        <Button onClick={goToLogin} sx={{ mt: 2, color: "#3B82F6" }}>
          Back to Login
        </Button>
      </Box>
    </Container>
  );
};

export default ForgetPassword;