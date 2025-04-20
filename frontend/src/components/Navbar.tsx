import React from 'react';
import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg" className="navbar-fixed py-1">
      <Container fluid className="px-4">
        <BsNavbar.Brand as={Link} to="/" className="py-0">Wildlife Sanctuary</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/dashboard" className="py-1">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/animals" className="py-1">Animals</Nav.Link>
                <Nav.Link as={Link} to="/habitats" className="py-1">Habitats</Nav.Link>
                {user.role === 'MANAGER' && (
                  <Nav.Link as={Link} to="/caretakers" className="py-1">Caretakers</Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link disabled className="py-1">Welcome, {user.username}</Nav.Link>
                <Nav.Link onClick={handleLogout} className="py-1">Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="py-1">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="py-1">Register</Nav.Link>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar; 