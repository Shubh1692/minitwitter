import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import {
    Link
} from 'react-router-dom';
import { API_DOMAIN } from '../../constant';


class Login extends Component {
    constructor(props) {
        super()
    }

    /**
     * @name login
     * @description
     * This method used to login user
     * @param email user email
     * @param password user password
    */
    async login({ email, password }) {
        const { cookies } = this.props;
        const loginReq = await fetch(`${API_DOMAIN}user/login/`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        try {
            const loginRes = await loginReq.json();
            if (loginRes.success) {
                cookies.set('token', loginRes.token, { path: '/' });
            }
            alert(loginRes.msg);
        } catch (error) {
            console.error(error);
            alert('Error in login');
        }
    }
    render() {
        return (
            <div className="d-flex align-items-center justify-content-center h-100">
                <Form className="d-flex flex-column" onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    this.login({
                        email: form.elements.email.value,
                        password: form.elements.password.value
                    });
                }}>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" required />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" required />
                    </Form.Group>
                    <Link to="/register">Create an account?</Link>
                    <Button className="text-center" variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        );
    }
}

export default Login;
