import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2';
import defaultImage from '../assets/giphy.webp';
import './BlogPostCard.css';

export default function BlogPostCard({ post }) {
    const { user } = useContext(UserContext);
    const { _id, title, content, author, image } = post;
    const [card, setCard] = useState();
    const navigate = useNavigate();

    const handleDeletePost = async () => {
        try {
            if (!user || !user.isAdmin) {
                Swal.fire({
                    title: 'Admin Access Required',
                    icon: 'info',
                    confirmButtonColor: 'success',
                    confirmButtonText: 'Log in as Admin'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/login');
                    }
                });
            } else {
                const response = await fetch(`https://blogapp-ancheta.onrender.com/posts/deletePost/${_id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    Swal.fire({
                        title: 'Post deleted successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        window.location.reload(); // Reload to reflect changes
                    });
                } else {
                    const errorData = await response.json();
                    console.log('Error deleting post:', errorData);
                    Swal.fire('Error', 'Unable to delete post', 'error');
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Swal.fire('Error', 'Something went wrong', 'error');
        }
    };

    useEffect(() => {
        setCard(
            <>
                <section className='card-section'>
                    <div className='card-container'>
                        <div className="image-card" style={{ backgroundImage: `url(${image || defaultImage})` }}>
                        </div>
                        <div className='card-content'>
                            <h6 className='card-title'>{title}</h6>
                            <p className="card-author">By {author.username}</p>
                            <p className='card-content-preview'>{content.slice(0, 100)}...</p>
                        </div>
                    </div>

                    <div className='button'>
                        <Link className='btn-view' as={Link} to={`/post/${_id}`}>View</Link>
                        {user && user.isAdmin && (
                            <button className='btn-delete' onClick={handleDeletePost}>Delete</button>
                        )}
                    </div>
                </section>
            </>
        );
    }, [post]);

    return (
        <>
            {card}
        </>
    );
}
