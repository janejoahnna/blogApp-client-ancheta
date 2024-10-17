import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost'; // For creating new posts
import AdminDashboard from './pages/AdminDashboard'; // Admin dashboard page
import Error from './pages/Error';

import './App.css';
import { UserProvider } from './context/UserContext';

function App() {
    const [user, setUser] = useState({
        id: null,
        isAdmin: false // Initialize isAdmin property
    });

    const unsetUser = () => {
        localStorage.clear();
        setUser({ id: null, isAdmin: false });
    };

    useEffect(() => {
        fetch(`https://blogapp-ancheta.onrender.com/user/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.user) {
                setUser({
                    id: data.user._id,
                    isAdmin: data.user.isAdmin
                });
            } else {
                setUser({ id: null, isAdmin: false });
            }
        })
        .catch(error => console.error('Error fetching user details:', error));
    }, []);

    return (
        <UserProvider value={{ user, setUser, unsetUser }}>
            <Router>
                <AppNavbar />
                <Container>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/blogposts" element={<BlogPost />} />
                        <Route path="/post/:postId" element={<BlogPost />} /> {/* Route for individual blog post */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/createPost" element={<CreatePost />} /> {/* Route for creating new posts */}
                        {user.isAdmin && <Route path="/admin-dashboard" element={<AdminDashboard />} />} {/* Admin Dashboard route */}
                        <Route path="*" element={<Error />} />
                    </Routes>
                </Container>
            </Router>
        </UserProvider>
    );
}

export default App;
