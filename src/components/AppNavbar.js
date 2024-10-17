import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';
import './AppNavbar.css';

export default function AppNavbar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar bg="primary" expand="lg">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">Blog Posts</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                        {user.id !== null ? (
                            <>
                                <Nav.Link as={NavLink} to="/blogposts" end>Blog Posts</Nav.Link>
                                {user.isAdmin && (
                                    <Nav.Link as={NavLink} to="/admin-dashboard">Admin Dashboard</Nav.Link>
                                )}
                                <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
