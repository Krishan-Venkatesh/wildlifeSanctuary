import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: Yup.string()
    .oneOf(['MANAGER', 'CARETAKER'], 'Please select a valid role')
    .required('Role is required'),
});

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  return (
    <Container className="mt-5">
      <div className="mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Register</h2>
        <Formik
          initialValues={{ username: '', password: '', role: '' }}
          validationSchema={registerSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await register(values.username, values.password, values.role);
              navigate('/dashboard');
            } catch (err) {
              setError('Registration failed. Username might be taken.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.username && !!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.password && !!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.role && !!errors.role}
                >
                  <option value="">Select a role</option>
                  <option value="MANAGER">Manager</option>
                  <option value="CARETAKER">Caretaker</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.role}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="w-100"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default Register; 