import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';

export default function Register() {

  const {user} = useContext(UserContext);

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

    const [isActive, setIsActive] = useState(false);

  function registerUser(e) {
    // Prevents page redirection via form submission
    e.preventDefault();

    fetch('https://blogapp-ancheta.onrender.com/user/register', {
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
        if (data.message === "Registered Successfully") {
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            Swal.fire({
                title: "Registration Successful",
                icon: "success",
                text: "Thank you for registering!"
            }).then(() => { 
                // Corrected part
                window.location.href = "/login"; 
            }); // This closing bracket was missing
        } else {
            Swal.fire({
                title: "Something went wrong.",
                icon: "error",
                text: "Please try again later or contact us for assistance"
            });
        }
    })
    .catch(err => {
        console.error("Error during registration:", err); // Optional: Log the error for debugging
        Swal.fire({
            title: "Something went wrong.",
            icon: "error",
            text: "Please try again later or contact us for assistance"
        });
    });
}
    


  useEffect(()=>{

    if((email !== "" && password !=="" && confirmPassword !=="") && (password === confirmPassword)){

      setIsActive(true)

    } else {

      setIsActive(false)

    }

  },[email,password,confirmPassword])

  return (

    (user.id !== null) ?
        <Navigate to="/login" />
    :
      
      <Form onSubmit={(e) => registerUser(e)}>
      <h1 className="my-5 text-center">Register</h1>

        <Form.Group>
          <Form.Label>Email:</Form.Label>
          <Form.Control 
          type="email"
          placeholder="Enter Email" 
          required 
          value={email} 
          onChange={e => {setEmail(e.target.value)}}/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control 
          type="password" 
          placeholder="Enter Password" 
          required 
          value={password} 
          onChange={e => {setPassword(e.target.value)}}/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Confirm Password:</Form.Label>
          <Form.Control 
          type="password" 
          placeholder="Confirm Password" 
          required 
          value={confirmPassword} 
          onChange={e => {setConfirmPassword(e.target.value)}}/>
        </Form.Group>
        {
          isActive

          ? <Button variant="primary" type="submit">Submit</Button>
          : <Button variant="primary" disabled>Submit</Button>
        }
      </Form>
    
    )
}