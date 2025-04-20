import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>('');

  const from = location.state?.from?.pathname || '/dashboard';

  return (
    <Container className="mt-5">
      <div className="mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await login(values.username, values.password);
              navigate(from, { replace: true });
            } catch (err) {
              setError('Invalid username or password');
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

              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="w-100"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default Login; 