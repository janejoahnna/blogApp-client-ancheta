import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import './Home.css';

export default function Home() {
    const { user } = useContext(UserContext);

    return (
        <Container className="home-container">
            <div className="home-content">
                <h1 className="home-title">Welcome to the Blog App</h1>
                <p className="home-subtitle">
                    {user && user.id !== null ? (
                        <>
                            <Link to="/blogposts" className="home-link">Go to Blog Posts</Link>
                        </>
                    ) : (
                        <>
                            Please <Link to="/login" className="home-link">Login</Link> or <Link to="/register" className="home-link">Register</Link> to start blogging!
                        </>
                    )}
                </p>
            </div>
        </Container>
    );
}
