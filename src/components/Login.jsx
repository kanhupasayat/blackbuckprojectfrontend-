import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleForm = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading spinner

        try {
            const response = await axios.post(
                "https://kanhupasayatweb.pythonanywhere.com/api/loginpage/",
                loginData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Extract tokens and user ID
            const { token, userId } = response.data;
            const accessToken = token.access;
            const refreshToken = token.refresh;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userId", userId);

            setSuccess("User logged in successfully!");
            setError("");
            setTimeout(() => {
                navigate("/"); // Redirect after a delay
            }, 1000);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.detail || "Login failed. Please try again.");
            } else {
                setError("Network error. Please try again later.");
            }
            setSuccess("");
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    return (
        <form
            onSubmit={handleForm}
            style={{
                position: "absolute",
                top: "50%",
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
                    value={loginData.email}
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
                    value={loginData.password}
                    onChange={handleChange}
                />
            </Box>
            <br />
            <Button variant="contained" type="submit" disableElevation disabled={loading}>
                Log in
            </Button>
            <br />
            <br />
            <Link
                to="/forgotpassword"
                style={{ marginTop: "10px", display: "inline-block" }}
            >
                Forgot Password?
            </Link>

            <Stack spacing={2} style={{ marginTop: "20px" }}>
                {success && <Alert severity="success">{success}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
            </Stack>

            {/* Show spinner while loading */}
            {loading && <CircularProgress color="success" sx={{ marginTop: "20px" }} />}
        </form>
    );
};

export default Login;

