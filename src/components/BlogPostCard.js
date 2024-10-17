import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import defaultImage from '../assets/giphy.webp';
import './BlogPostCard.css';

export default function BlogPostCard({ post }) {
    const { _id, title, content, author, image } = post;
    const [card, setCard] = useState();

    useEffect(() => {
        setCard(
            <>
                <section className='card-section'>
                    <div className='card-container'>
                        <div className="image-card" style={{ backgroundImage: `url(${image || defaultImage})` }}>
                        </div>
                        <div className='card-content'>
                            <h6 className='card-title'>{title}</h6>
                            <p className="card-author">By {author || 'Unknown Author'}</p> {/* Display author as string */}
                            <p className='card-content-preview'>{content.slice(0, 100)}...</p>
                        </div>
                    </div>

                    <div className='button'>
                        <Link className='btn-view' to={`/post/${_id}`}>View</Link>
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
