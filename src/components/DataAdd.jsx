import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import CallIcon from "@mui/icons-material/Call";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import CircularProgress from '@mui/material/CircularProgress';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DataAdd = () => {
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  const [addData, setAddData] = useState(""); // Phone number state
  const [dateData, setDateData] = useState(null);
  const [timeData, setTimeData] = useState(null);
  const [message, setMessage] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [submittedData, setSubmittedData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Keep only digits
    setAddData(value);
  };

  const handleDateChange = (newValue) => setDateData(newValue);
  const handleTimeChange = (newValue) => setTimeData(newValue);
  const handleMessageChange = (e) => setMessage(e.target.value);
  const handleCallStatus = (e) => setCallStatus(e.target.value);

  const fetchSubmittedData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/userdatastore/?user=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSubmittedData(response.data);
      console.log("ok", response.data);
    } catch (error) {
      console.error("Error fetching submitted data:", error);
    }
  };

  const isValidForm = () => {
    if (addData.length !== 10) {
      setSuccessMessage("Phone number must be exactly 10 digits long.");
      setIsError(true);
      setSnackbarOpen(true);
      return false;
    }
    if (!dateData || !timeData) {
      setSuccessMessage("Please select both date and time.");
      setIsError(true);
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidForm()) return;

    setLoading(true); // Start loading spinner

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/userdatastore/",
        {
          phone_number: addData,
          date: dateData.format("YYYY-MM-DD"),
          time: timeData.format("HH:mm"),
          call_status: callStatus,
          message: message.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setSuccessMessage("Data submitted successfully!");
      setIsError(false);
      setSnackbarOpen(true);
      setAddData("");
      setDateData(null);
      setTimeData(null);
      setCallStatus("");
      setMessage("");
      fetchSubmittedData();
    } catch (error) {
      setSuccessMessage(error.response?.data?.detail || "Error submitting data.");
      setIsError(true);
      setSnackbarOpen(true);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  useEffect(() => {
    fetchSubmittedData();
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          textAlign: "center",
        }}
      >
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <TextField
            fullWidth
            label="Mobile Number"
            id="mobileNumber"
            value={addData}
            onChange={handleInputChange}
            inputProps={{ maxLength: 10 }}
          />
        </Box>
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={dateData}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <br />
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Select Time"
            value={timeData}
            onChange={handleTimeChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <br />
        <br />
        <FormControl>
          <FormLabel>{<CallIcon />}</FormLabel>
          <RadioGroup row value={callStatus} onChange={handleCallStatus}>
            <FormControlLabel value="Call Back" control={<Radio />} label="Call Back" />
            <FormControlLabel value="Interested - Follow Up" control={<Radio />} label="Interested - Follow Up" />
            <FormControlLabel value="Interest not confirmed - Follow up" control={<Radio />} label="Interest not confirmed - Follow up" />
          </RadioGroup>
        </FormControl>
        <br />
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <TextField
            fullWidth
            label="Message"
            id="message"
            value={message}
            onChange={handleMessageChange}
          />
        </Box>
        <br />
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="success" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Stack>
      </form>

      {/* Snackbar for success/error message */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={isError ? "error" : "success"} sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DataAdd;
