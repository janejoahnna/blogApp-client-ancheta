import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Image, Row, Col, Form } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2';

export default function BlogPost() {
    const { postId } = useParams();  // Capture postId from URL
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const { user } = useContext(UserContext);  // Get user context for auth
    const navigate = useNavigate();  // Used to redirect if needed

    // Fetch specific post by ID
    const fetchPost = async () => {
    try {
        const response = await fetch(`https://blogapp-ancheta.onrender.com/posts/getPost/${postId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            console.error('Response status:', response.status); // Log the status code
            throw new Error('Post not found');
        }
        const data = await response.json();
        setPost(data);
    } catch (error) {
        console.error('Error fetching post:', error);
        Swal.fire({
            title: 'Post Not Found',
            text: 'The post you are looking for does not exist.',
            icon: 'error'
        });
        navigate('/'); // Redirect to home or another page
    }
};


    // Fetch all posts and check if there are any
    const fetchAllPosts = async () => {
        try {
            const response = await fetch(`https://blogapp-ancheta.onrender.com/posts/getPosts`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Error fetching posts');
            }
            const data = await response.json();
            setPost(data); // Assuming you have setPosts to manage a list of posts
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
                const response = await fetch(`https://blogapp-ancheta.onrender.com/posts/addComment/${postId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        content: comment,
                        userId: user.id,
                    })
                });

                if (response.ok) {
                    Swal.fire({
                        title: 'Comment added!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    setComment(''); // Clear comment input
                    await fetchPost(); // Refresh post to show new comment
                } else {
                    Swal.fire('Error', 'Unable to add comment', 'error');
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Swal.fire('Error', 'Something went wrong', 'error');
        }
    };

    // If post is still loading, show a loading state
    if (post === null) {
        return (
            <Row className='d-flex justify-content-center flex-row py-5'>
                <h1 className='text-center'>No posts yet.</h1>
            </Row>
        );
    }

    return (
        <Container className="py-5 card d-flex justify-content-center" style={{ maxWidth: '900px' }}>
            <Row className="d-flex align-items-center">
                {/* Post Image */}
                <Col md={6} className="text-center">
                    <Image
                        src={post.image || 'https://via.placeholder.com/300'}
                        alt={post.title}
                        style={{ width: '100%', maxWidth: '300px', height: 'auto', marginBottom: '20px' }}
                    />
                </Col>

                {/* Post Details */}
                <Col md={6} className="post-details">
                    <h1 className="post-title">{post.title}</h1>
                    <p className="post-author">By: {post.author ? post.author.username : 'Unknown Author'}</p>
                    <p className="post-content">
                        {post.content}
                    </p>
                </Col>
            </Row>

            {/* Comment Section */}
            <Row className="mt-4">
                <Col>
                    <h5>Comments</h5>
                    <ul>
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                                <li key={comment._id}>
                                    <p><strong>{comment.user.username}:</strong> {comment.content}</p>
                                </li>
                            ))
                        ) : (
                            <p>No comments yet.</p>
                        )}
                    </ul>
                    {user && (
                        <>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Write a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="mb-3"
                            />
                            <Button onClick={handleAddComment} variant="primary">
                                Add Comment
                            </Button>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
