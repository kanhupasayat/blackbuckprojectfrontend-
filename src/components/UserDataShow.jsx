import React, { useEffect, useState } from "react";
import { format, isToday } from "date-fns";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import * as XLSX from "xlsx";
import MuiButton from "@mui/material/Button";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import BootstrapButton from "react-bootstrap/Button"; // Renamed Button from react-bootstrap

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UserDataShow = () => {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredQuery, setFilteredQuery] = useState(""); // New state to store the query for search filtering

  const navigate = useNavigate();

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      setError("No refresh token found. Please log in.");
      navigate("/login");
      return null;
    }

    try {
      const response = await axios.post(
        "https://kanhupasayatweb.pythonanywhere.com/api/v1/token/refresh/",
        {
          refresh: refreshToken,
        }
      );

      const { access } = response.data;
      localStorage.setItem("accessToken", access);
      return access;
    } catch (err) {
      console.error("Failed to refresh access token:", err);
      setError("Session expired. Please log in again.");
      navigate("/login");
      return null;
    }
  };

  const fetchUserData = async (accessToken) => {
    try {
      const response = await axios.get("https://kanhupasayatweb.pythonanywhere.com/api/user-data/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (Array.isArray(response.data)) {
        setUserData(response.data);
      } else {
        setError("Unexpected data format received.");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          fetchUserData(newAccessToken);
        }
      } else if (err.response) {
        setError(`Error fetching user data: ${err.response.data.detail}`);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (phone_id) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("No access token found. Please log in.");
      return;
    }

    try {
      await axios.delete(
        `https://kanhupasayatweb.pythonanywhere.com/api/datastore/delete/${phone_id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setUserData((prevData) =>
        prevData.filter((item) => !(item.phone_id === phone_id))
      );
      setSuccessMessage("Data deleted successfully!");
      setSnackbarOpen(true);
    } catch (err) {
      setError("Failed to delete the data. Please try again.");
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("No access token found. Please log in.");
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    fetchUserData(accessToken);
  }, [navigate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setSuccessMessage("Copy Number successfully!");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(userData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Data");
    XLSX.writeFile(workbook, "UserData.xlsx");
  };

  const handleSearch = () => {
    setFilteredQuery(searchQuery); // Set the filtered query when the search button is clicked
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>{error}</p>;
  if (userData.length === 0) return <p>No data available.</p>;

  const filteredData = filteredQuery
    ? userData.filter((item) => item.phone_number.includes(filteredQuery))
    : userData;

  return (
    <>
      <Stack spacing={1} style={{ padding: "10px" }} direction="row">
        <MuiButton variant="contained" color="success">
          <Nav.Link href="/today" style={{ color: "#ffffff" }}>
            Today
          </Nav.Link>
        </MuiButton>
      </Stack>
      <Stack spacing={1} style={{ padding: "10px" }} direction="row">
        <MuiButton variant="contained" color="success">
          <Nav.Link onClick={exportToExcel}>Export to Excel</Nav.Link>
        </MuiButton>
      </Stack>

      <Form
        className="d-flex"
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#eb2f06",
          textAlign: "center",
        }}
      >
        <Form.Control
          type="search"
          placeholder="Mobile _Number"
          className="me-2"
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <BootstrapButton variant="outline-success" onClick={handleSearch}>
          Search
        </BootstrapButton>
      </Form>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Mobile Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Call Status</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice()
                .reverse()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell>
                      {item.phone_number}
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(item.phone_number)}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: isToday(new Date(item.date))
                          ? "#006266"
                          : "#EA2027",
                      }}
                    >
                      {isToday(new Date(item.date))
                        ? format(new Date(item.date), "MM/dd/yyyy")
                        : format(new Date(item.date), "MM/dd/yyyy")}
                    </TableCell>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{item.call_status}</TableCell>
                    <TableCell>{item.message}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => {
                            const phone_id = item.phone_id;
                            const phoneNumber = encodeURIComponent(
                              item.phone_number
                            );
                            const date = encodeURIComponent(item.date);
                            const time = encodeURIComponent(item.time);
                            const callStatus = encodeURIComponent(
                              item.call_status
                            );
                            const message = encodeURIComponent(item.message);

                            navigate(
                              `/edit-user-data/${phone_id}/${phoneNumber}/${date}/${time}/${callStatus}/${message}`
                            );
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(item.phone_id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={userData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserDataShow;
