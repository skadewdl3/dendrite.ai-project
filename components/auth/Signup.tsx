"use client";
import { authClient } from "@/lib/auth/client";
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const SignupComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Here you would typically call an API to register the user
    const res = await authClient.signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });
    console.log("Form submitted:", formData);
    setSuccess(true);
    setError(null);
    setValidated(true);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <div className="shadow p-4 mb-5 bg-white rounded">
            <h2 className="text-center mb-4">Sign Up</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && (
              <Alert variant="success">Registration successful!</Alert>
            )}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide your first name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  minLength={8}
                />
                <Form.Control.Feedback type="invalid">
                  Password must be at least 8 characters.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
                <Form.Control.Feedback type="invalid">
                  Please confirm your password.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="terms">
                <Form.Check
                  required
                  label="Agree to terms and conditions"
                  feedback="You must agree before submitting."
                  feedbackType="invalid"
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit">
                  Sign Up
                </Button>
              </div>

              <div className="text-center mt-3">
                Already have an account? <a href="/login">Login</a>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupComponent;
