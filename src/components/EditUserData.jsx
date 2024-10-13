import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import CallIcon from "@mui/icons-material/Call";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Input from "@mui/material/Input";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useParams, useNavigate } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditUserData = () => {
  const { phone_id, mobileNumber, date, time, callStatus, message } =
    useParams();
  const navigate = useNavigate();

  // Initialize state
  const [phoneid, setPhoneId] = useState(phone_id || "");
  const [addData, setAddData] = useState(mobileNumber || "");
  const [dateData, setDateData] = useState(dayjs(date) || dayjs());
  const [timeData, setTimeData] = useState(
    dayjs()
      .hour(parseInt(time.split(":")[0]))
      .minute(parseInt(time.split(":")[1]))
  );
  const [callStatusState, setCallStatus] = useState(callStatus || "");
  const [messageText, setMessage] = useState(message || "");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Default to success

  // Handlers for form inputs
  const handlePhoneIdChange = (event) => setPhoneId(event.target.value);
  const handleInputChange = (event) => setAddData(event.target.value);
  const handleDateChange = (newValue) => setDateData(newValue);
  const handleTimeChange = (newValue) => setTimeData(newValue);
  const handleCallStatus = (event) => setCallStatus(event.target.value);
  const handleMessageChange = (event) => setMessage(event.target.value);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      phone_id: phoneid,
      phone_number: addData,
      date: dateData.format("YYYY-MM-DD"),
      time: timeData.format("HH:mm"),
      call_status: callStatus,
      message: messageText,
    };

    console.log("Submitting user data:", userData);

    try {
      const accessToken = localStorage.getItem("accessToken"); // Get the access token from localStorage
      console.log(accessToken);

      if (!accessToken) {
        setSnackbarMessage("You are not authenticated");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      const response = await axios.put(
        `https://kanhupasayatweb.pythonanywhere.com/api/datastore/update/${phoneid}/`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Add token to headers
          },
        }
      );

      if (response.status === 200) {
        console.log("Data updated successfully:", response.data);
        setSnackbarMessage("Data updated successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/userdatashow"); // Navigate to user data page upon success
        }, 1000); // Delay navigation to allow the user to see the message
      } else {
        setSnackbarMessage("Failed to update data");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error during the update:", error);
      setSnackbarMessage("An error occurred during the update.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
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
          color: "#eb2f06",
          textAlign: "center",
        }}
      >
        <Input
          type="hidden"
          id="phone_id"
          value={phoneid}
          onChange={handlePhoneIdChange} // Note: onChange is not needed for hidden inputs
        />

        <br />
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <TextField
            fullWidth
            label="Mobile Number"
            id="mobileNumber"
            value={addData}
            onChange={handleInputChange}
            required
          />
        </Box>
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={dateData}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} required />}
          />
        </LocalizationProvider>
        <br />
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Select Time"
            value={timeData}
            onChange={handleTimeChange}
            renderInput={(params) => <TextField {...params} required />}
          />
        </LocalizationProvider>
        <br />
        <br />
        <FormControl>
          <FormLabel>{<CallIcon />}</FormLabel>
          <RadioGroup
            row
            value={callStatusState} onChange={handleCallStatus}
            required
          >
            <FormControlLabel
              value="Call Back"
              control={<Radio />}
              label="Call Back"
            />
            <FormControlLabel
              value="Interested - Follow Up"
              control={<Radio />}
              label="Interested - Follow Up"
            />
            <FormControlLabel
              value="Interest not confirmed - Follow up"
              control={<Radio />}
              label="Interest not confirmed - Follow up"
            />
          </RadioGroup>
        </FormControl>
        <br />
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <TextField
            fullWidth
            label="Message"
            id="message"
            value={messageText}
            onChange={handleMessageChange}
            required
          />
        </Box>
        <br />
        <br></br>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="success" type="submit">
            Update
          </Button>
        </Stack>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditUserData;
