import React from 'react';
import BootstrapButton from 'react-bootstrap/Button'; // Renamed Button from react-bootstrap
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import MuiButton from '@mui/material/Button'; // Renamed Button from MUI


function NavScrollExample() {
  const navigate = useNavigate();


  // Handle logout function
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  // Check if the user is logged in (based on token presence)
  const isLoggedIn = !!localStorage.getItem("accessToken");

  return (
    <Navbar expand="lg" className="bg-body-red">
      <Container fluid>
        <Navbar.Brand href="/">
          <img 
            src="https://www.resolveindia.com/resolvex/wp-content/uploads/2020/07/Blackbuck.png" 
            alt="Blackbuck Logo"
            style={{ height: '40px' }} // Adjust height as needed
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '60px' }} navbarScroll>
            <Stack spacing={1} style={{padding:"10px"}} direction="row">
              <MuiButton variant="contained" color="success"><Nav.Link href="/" style={{color:"#ffffff"}}>Home</Nav.Link></MuiButton>
            </Stack>

            {/* Conditionally render Login/Signup or Logout */}
            {!isLoggedIn ? (
              <>
              <Stack spacing={1} style={{padding:"10px"}} direction="row">
              <MuiButton variant="contained" color="success"><Nav.Link href="/signup" style={{color:"#ffffff"}}>Sign Up</Nav.Link></MuiButton>
            </Stack>

            <Stack spacing={1} style={{padding:"10px"}} direction="row">
              <MuiButton variant="contained" color="success"><Nav.Link href="/login" style={{color:"#ffffff"}}>Login</Nav.Link>
              </MuiButton>
            </Stack>
                
              </>
            ) : (
              <>
              <Stack spacing={1} style={{padding:"10px"}} direction="row">
              <MuiButton variant="contained" color="success"><Nav.Link onClick={handleLogout} style={{color:"#ffffff"}}>Logout</Nav.Link>
              </MuiButton>
            </Stack>
            <Stack spacing={1} style={{padding:"10px"}} direction="row">
              <MuiButton variant="contained" color="success"><Nav.Link href="/dataadd" style={{color:"#ffffff"}}>AddData</Nav.Link>
              </MuiButton>
            </Stack>

            <Stack spacing={1} style={{padding:"10px"}} direction="row">
              <MuiButton variant="contained" color="success"><Nav.Link href="/userdatashow" style={{color:"#ffffff"}}>Show Data</Nav.Link>
              </MuiButton>
            </Stack>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
