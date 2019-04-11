import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import {
    Link
} from 'react-router-dom';
import { API_DOMAIN } from '../../constant';

class Register extends Component {
    constructor(props) {
        super()
    }

    /**
     * @name register
     * @description
     * This method used to register user
     * @param email user email
     * @param password user password
     * @param name user name
    */
    async register({ email, password, name }) {
        const { cookies } = this.props;
        const registerReq = await fetch(`${API_DOMAIN}user/register/`, {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        try {
            const registerRes = await registerReq.json();
            if (registerRes.success) {
                cookies.set('token', registerRes.token, { path: '/' });
            }
            alert(registerRes.msg);
        } catch (error) {
            console.error(error);
            alert('Error in register');
        }
    }

    render() {
        return (
            <div className="d-flex align-items-center justify-content-center h-100">
                <Form className="d-flex flex-column" onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    this.register({
                        email: form.elements.email.value,
                        password: form.elements.password.value,
                        name: form.elements.name.value
                    });
                }}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" required />
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" required/>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" required/>
                    </Form.Group>
                    <Link to="/login">Already have an account?</Link>
                    <Button className="text-center" variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        );
    }
}

export default Register;
