import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/sent-reset-password-email/",
        { email }
      );
      setMessage("Password reset email sent!");
      setError("");
    } catch (err) {
      setError("Failed to send email. Please try again.");
      setMessage("");
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "#eb2f06",
        textAlign: "center",
      }}
    >
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <Box sx={{ width: 300, maxWidth: "100%" }}>
          <TextField
            fullWidth
            label="Email ID"
            value={email}
            onChange={handleEmailChange}
          />
        </Box>
        <br />
        <Button variant="contained" type="submit" disableElevation>
          Send Reset Link
        </Button>
      </form>

      <Stack spacing={2} style={{ marginTop: "20px" }}>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </div>
  );
};

export default ForgotPassword;
