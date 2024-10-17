import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostAuthor, setNewPostAuthor] = useState('');
    const [newPostCreationDate, setNewPostCreationDate] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`https://blogapp-ancheta.onrender.com/posts/getPosts`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();
            setPosts(data); // Assuming `author` is already a string in each post object
        } catch (error) {
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Unable to fetch posts.',
            });
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async () => {
        try {
            const response = await fetch(`https://blogapp-ancheta.onrender.com/posts/addPost`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newPostTitle,
                    content: newPostContent,
                    author: newPostAuthor,
                    createdAt: newPostCreationDate
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            Swal.fire({
                title: 'Success',
                icon: 'success',
                text: 'Post created successfully!',
            });

            setShowModal(false);
            setNewPostTitle('');
            setNewPostContent('');
            setNewPostAuthor('');
            setNewPostCreationDate('');

            await fetchPosts();

        } catch (error) {
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Unable to create post.',
            });
        }
    };

    const handleUpdate = (postId, post) => {
        setSelectedPostId(postId);
        setNewPostTitle(post.title);
        setNewPostContent(post.content);
        setNewPostAuthor(post.author);
        setNewPostCreationDate(new Date(post.createdAt).toISOString().slice(0, 10));
        setShowUpdateModal(true);
    };

    const handleSaveUpdate = async () => {
        const updateData = {
            title: newPostTitle,
            content: newPostContent,
            author: newPostAuthor,
            createdAt: newPostCreationDate
        };

        try {
            const response = await fetch(`https://blogapp-ancheta.onrender.com/posts/updatePost/${selectedPostId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error('Failed to update post');
            }

            Swal.fire({
                title: 'Success',
                icon: 'success',
                text: 'Post updated successfully!',
            });

            setShowUpdateModal(false);
            await fetchPosts();
        } catch (error) {
            console.error("Error updating post:", error);
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Unable to update post.',
            });
        }
    };


    const handleDeletePost = async (postId) => {
        console.log("Attempting to delete post with ID:", postId); // Log the post ID
        try {
            const response = await fetch(`https://blogapp-ancheta.onrender.com/posts/deletePost/${postId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error deleting post:", errorData);
                throw new Error('Failed to delete post');
            }

            Swal.fire({
                title: 'Deleted',
                icon: 'success',
                text: 'Post deleted successfully!',
            });

            await fetchPosts();

        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Unable to delete post.',
            });
        }
    };


    return (
    <>
        <section className="admin-dashboard mt-5 pt-5">
            <h1 className="mb-4">Admin Dashboard</h1>

            <div className="dashboard-actions">
                <Button className="btn btn-primary mb-3" variant="primary" onClick={() => setShowModal(true)}>Add New Post</Button>
            </div>

            {posts.length > 0 ? (
                <Table striped bordered hover className="posts-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Author</th>
                            <th>Creation Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post._id}>
                                <td>{post.title}</td>
                                <td>{post.content.slice(0, 100)}...</td>
                                <td>{typeof post.author === 'string' ? post.author : 'Unknown Author'}</td>
                                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <Button className="action-btn btn btn-primary" variant="primary" onClick={() => handleUpdate(post._id, post)}>Update</Button>
                                    <Button className="action-btn btn btn-danger ml-2" variant="danger" onClick={() => handleDeletePost(post._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <div className='d-flex justify-content-center align-items-center flex-column'>
                    <h1>No Posts Yet</h1>
                </div>
            )}

            {/* Modal for adding new post */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formPostTitle">
                            <Form.Label>Post Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter post title" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} maxLength={80}/>
                        </Form.Group>

                        <Form.Group controlId="formPostContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control as="textarea" rows={4} placeholder="Enter content" value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formPostAuthor">
                            <Form.Label>Author</Form.Label>
                            <Form.Control type="text" placeholder="Enter author name" value={newPostAuthor} onChange={(e) => setNewPostAuthor(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formPostCreationDate">
                            <Form.Label>Creation Date</Form.Label>
                            <Form.Control type="date" value={newPostCreationDate} onChange={(e) => setNewPostCreationDate(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCreatePost}>
                        Add Post
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for updating post */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formPostTitle">
                            <Form.Label>Post Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter post title" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} maxLength={80}/>
                        </Form.Group>

                        <Form.Group controlId="formPostContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control as="textarea" rows={4} placeholder="Enter content" value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formPostAuthor">
                            <Form.Label>Author</Form.Label>
                            <Form.Control type="text" placeholder="Enter author name" value={newPostAuthor} onChange={(e) => setNewPostAuthor(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formPostCreationDate">
                            <Form.Label>Creation Date</Form.Label>
                            <Form.Control type="date" value={newPostCreationDate} onChange={(e) => setNewPostCreationDate(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveUpdate}>
                        Save Changes
                    </Button>
                    <Button variant="danger" onClick={() => handleDeletePost(selectedPostId)}>
                        Delete Post
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    </>
    );
}
