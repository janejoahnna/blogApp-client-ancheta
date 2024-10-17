import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';

export default function Login() {

  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isActive, setIsActive] = useState(true);


    function authenticate(e) {

        e.preventDefault();
    fetch('https://blogapp-ancheta.onrender.com/user/login',{

    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({

      email: email,
      password: password

    })
  })
  .then(res => res.json())
  .then(data => {
    
    if(data.access){

      localStorage.setItem('token', data.access);
      retrieveUserDetails(data.access);

      Swal.fire({
              title: "Login Successful",
              icon: "success",
              text: "Welcome to the Blog App!"
          });
    
    } else {

      Swal.fire({
                title: "Authentication failed",
                icon: "error",
                text: "Check your login details and try again."
            });
    }
  })

  setEmail('');
  setPassword('');


    }


    const retrieveUserDetails = (token) => {

        fetch('https://blogapp-ancheta.onrender.com/user/details', {
            headers: {
                Authorization: `Bearer ${ token }`
            }
        })
        .then(res => res.json())
        .then(data => {

            setUser({
              id: data.user._id,
            });

        })

    };

    useEffect(() => {

        // Validation to enable submit button when all fields are populated and both passwords match
        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);

    return (
      (user.id !== null) ?

      <Navigate to="/" />

      :
        
          <Form onSubmit={(e) => authenticate(e)}>
            <h1 className="my-5 text-center">Login</h1>
              <Form.Group controlId="userEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control 
                      type="text"
                      placeholder="Enter email"
                      value={email}
                  onChange={(e) => setEmail (e.target.value)}
                      required
                  />
              </Form.Group>

              <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                      type="password" 
                      placeholder="Password"
                      value={password}
                  onChange={(e) => setPassword(e.target.value)}
                      required
                  />
              </Form.Group>

               { isActive ? 
                  <Button variant="primary" type="submit" id="submitBtn">
                      Submit
                  </Button>
                  : 
                  <Button variant="danger" type="submit" id="submitBtn" disabled>
                      Submit
                  </Button>
              }
          </Form>
    )
}