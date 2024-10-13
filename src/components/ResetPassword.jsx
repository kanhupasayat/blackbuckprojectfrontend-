import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ResetPassword = () => {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState(""); // New field for confirm password
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePassword2Change = (e) => {
    setPassword2(e.target.value); // Handle confirm password change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError("Passwords do not match.");
      setMessage("");
      return;
    }
    try {
      const response = await axios.post(
        `https://kanhupasayatweb.pythonanywhere.com/api/reset-password/${uid}/${token}/`,
        {
          password,
          password2, // Include confirm password in the payload
        }
      );

      // Assuming your API returns a success message
      setMessage("Password reset successfully!");
      setError("");
      
      // Navigate to home or any other page after successful reset
      navigate('/singup'); 
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      setMessage("");
      console.error(err); // Log error response for debugging
    }
  };

  return (
    <div style={{
      position: "absolute",
      top: "55%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "#eb2f06",
      textAlign: "center",
    }} >
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <Box sx={{ width: 300, maxWidth: "100%" }}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <br></br>
          <br></br>
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={password2}
            onChange={handlePassword2Change}
          />
        </Box>
        <br />
        <Button variant="contained" type="submit" disableElevation>
          Reset Password
        </Button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
