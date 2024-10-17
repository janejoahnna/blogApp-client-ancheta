import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Logout() {
    const { unsetUser, setUser } = useContext(UserContext);

    useEffect(() => {
        unsetUser(); // Clear user data from local storage and context
        setUser({
            id: null,
            isAdmin: false // Set isAdmin to false for consistency
        });
    }, [unsetUser, setUser]); // Add dependencies to ensure proper execution

    return (
        <Navigate to='/login' /> // Redirect to login page after logout
    );
}
