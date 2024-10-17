import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function AppNavbar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar expand="lg" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #E0E0E0', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
            <Container fluid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Brand name on the left */}
                <Navbar.Brand as={Link} to="/" style={{ fontWeight: 'bold', color: '#2C3E50', fontSize: '1.5rem', textDecoration: 'none' }}>
                    My Blog App
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {/* Links on the right */}
                    <Nav className="navbar-nav" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Nav.Link as={NavLink} to="/" end style={{ color: '#2C3E50', fontSize: '1rem', fontWeight: 500 }}>
                            Home
                        </Nav.Link>
                        {user?.id ? (
                            <>
                                <Nav.Link as={NavLink} to="/blogposts" end style={{ color: '#2C3E50', fontSize: '1rem', fontWeight: 500 }}>
                                    Blog Posts
                                </Nav.Link>
                                {user.isAdmin && (
                                    <Nav.Link as={NavLink} to="/admin-dashboard" style={{ color: '#2C3E50', fontSize: '1rem', fontWeight: 500 }}>
                                        Admin Dashboard
                                    </Nav.Link>
                                )}
                                <Nav.Link as={Link} to="/logout" style={{ color: '#2C3E50', fontSize: '1rem', fontWeight: 500 }}>
                                    Logout
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" style={{ color: '#2C3E50', fontSize: '1rem', fontWeight: 500 }}>
                                    Login
                                </Nav.Link>
                                <Nav.Link as={Link} to="/register" style={{ color: '#2C3E50', fontSize: '1rem', fontWeight: 500 }}>
                                    Register
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
