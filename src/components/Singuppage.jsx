import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const Singuppage = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone_number: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState(""); // To capture any errors
  const [success, setSuccess] = useState(""); // To display success message
  const [shouldRedirect, setShouldRedirect] = useState(false); // State for redirecting

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForm = async (e) => {
    e.preventDefault();

    // Check if passwords match before sending the form
    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      setSuccess(""); // Clear success message
      return; // Stop form submission
    }

    // Send the form data to the Django backend
    try {
      const response = await axios.post(
        "https://kanhupasayatweb.pythonanywhere.com/api/register/",
        formData,
        {
          headers: {
            "Content-Type": "application/json", // Important to set the content type
          },
        }
      );

      // If successful, store the access and refresh tokens
      const { access, refresh } = response.data; // Adjust according to your API response structure
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      setSuccess("User registered successfully!"); // Set success message
      setError(""); // Clear any previous errors
      setShouldRedirect(true); // Trigger redirect

    } catch (err) {
      // Capture and set the error message if the API call fails
      if (err.response) {
        setError(
          "Registration failed: " +
            (err.response.data?.detail || "Please try again.")
        ); // Access error details if available
      } else {
        setError("Registration failed: Network Error or Server Unreachable.");
      }
      setSuccess(""); // Clear any previous success messages
      console.error(err); // Log the entire error object for debugging
    }
  };

  useEffect(() => {
    if (shouldRedirect) {
      const timer = setTimeout(() => {
        navigate('/login'); // Change '/login' to your desired route
      },2000);

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [shouldRedirect, navigate]);

  return (
    <>
      <form
        onSubmit={handleForm}
        style={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#eb2f06",
          textAlign: "center",
        }}
      >
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <TextField
            fullWidth
            label="Email ID"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Box>
        <br />
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Box>
        <br />
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone_number"
            type="tel" // Use "tel" instead of "number" for better formatting of phone numbers
            id="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </Box>
        <br />
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Box>
        <br />
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <TextField
            fullWidth
            label="Re-enter Password"
            name="password2"
            type="password"
            id="password2"
            value={formData.password2}
            onChange={handleChange}
          />
        </Box>
        <br />
        <Button variant="contained" type="submit" disableElevation>
          Sign up
        </Button>
        <br/>
        <br/>
        
        <Link
          to="/forgotpassword"
          style={{ marginup: "40px", display: "inline-block" }}
        >
          Forgot Password?
        </Link>

        <Stack spacing={2} style={{ marginTop: "20px" }}>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
      </form>

    </>
  );
};

export default Singuppage;
