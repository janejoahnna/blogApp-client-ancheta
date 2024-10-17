// client/src/pages/CreatePost.js
import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            Swal.fire({
                title: 'Please log in',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/addPost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title,
                    content
                })
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Post created successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                navigate('/blogposts');  // Redirect to the blog posts page
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: 'Error',
                    text: errorData.message || 'Failed to create post',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="container mt-5">
            <h2>Create a New Post</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle" className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter post title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Form.Group controlId="formContent" className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={5} 
                        placeholder="Enter post content" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}
