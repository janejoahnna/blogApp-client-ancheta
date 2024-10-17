import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Form } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2';
import './BlogPost.css';

export default function BlogPost() {
    const { postId } = useParams(); // Ensure postId is coming from URL params
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState('');
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const fetchAllPosts = async () => {
        try {
            const response = await fetch('https://blogapp-ancheta.onrender.com/posts/getPosts', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Error fetching posts');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            Swal.fire({
                title: 'Error',
                text: 'Unable to load posts.',
                icon: 'error'
            });
        }
    };

    useEffect(() => {
        fetchAllPosts();
    }, []);

    // Handle adding a comment to the post
    const handleAddComment = async () => {
        try {
            if (!user) {
                Swal.fire({
                    title: 'Please Login',
                    icon: 'info',
                    confirmButtonColor: 'success',
                    confirmButtonText: 'Log in'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/login');
                    }
                });
            } else {
                // Ensure postId is being captured
                console.log("Attempting to add comment to postId:", postId);
                console.log("User ID:", user.id);

                const response = await fetch(`https://blogapp-ancheta.onrender.com/posts/addComment/${postId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        content: comment,
                        userId: user.id // Ensure user.id exists
                    })
                });

                if (response.ok) {
                    Swal.fire({
                        title: 'Comment added!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    setComment(''); // Clear comment input
                    await fetchAllPosts(); // Refresh the posts to show new comment
                } else {
                    const errorData = await response.json(); // Capture the error response
                    console.error("Error response:", errorData);
                    Swal.fire('Error', 'Unable to add comment', 'error');
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Swal.fire('Error', 'Something went wrong', 'error');
        }
    };

    // Ensure that posts are loaded before rendering the content
    if (posts.length === 0) {
        return (
            <Row className="d-flex justify-content-center flex-row py-5">
                <h1 className="text-center">No posts yet.</h1>
            </Row>
        );
    }

    return (
        <Container className="blog-container">
            {posts.map(post => (
                <Row key={post._id} className="d-flex align-items-center mb-4">
                    <Col>
                        <h1 className="post-title">{post.title}</h1>
                        <p className="post-author">By: {post.author || 'Unknown Author'}</p>
                        <p className="post-date">Created on: {new Date(post.createdAt).toLocaleDateString()}</p>
                        <p className="post-content">{post.content}</p>
                    </Col>
                </Row>
            ))}
            <Row className="comments-container mt-4">
                <h5 className="comments-header">Comments</h5>
                <Col>
                    <ul>
                        {posts[0].comments && posts[0].comments.length > 0 ? (
                            posts[0].comments.map(comment => (
                                <li key={comment._id} className="comment-item">
                                    <p className="comment-author">{comment.user.username}:</p>
                                    <p className="comment-content">{comment.content}</p>
                                </li>
                            ))
                        ) : (
                            <p>No comments yet.</p>
                        )}
                    </ul>
                    {user && (
                        <div className="comment-form">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Write a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="comment-input"
                            />
                            <Button onClick={handleAddComment} className="add-comment-btn">
                                Add Comment
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
