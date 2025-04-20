import React from 'react';
import { Form } from 'react-bootstrap';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Caretaker } from '../types/models';
import FormField from './FormField';
import SubmitButton from './SubmitButton';
import { Field } from 'formik';

interface CaretakerFormProps {
  caretaker?: Caretaker;
  onSubmit: (data: Partial<Caretaker> & { username: string; password: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^\+?[\d\s-]+$/, 'Invalid phone number')
    .required('Phone number is required'),
  specialization: Yup.string().required('Specialization is required'),
});

const CaretakerForm: React.FC<CaretakerFormProps> = ({
  caretaker,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const initialValues = {
    username: '',
    password: '',
    name: caretaker?.name || '',
    email: caretaker?.email || '',
    phoneNumber: caretaker?.phoneNumber || '',
    specialization: caretaker?.specialization || '',
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, isSubmitting: formikSubmitting, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          {!caretaker && (
            <>
              <FormField
                name="username"
                label="Username"
                type="text"
                placeholder="Enter username for login"
              />
              <FormField
                name="password"
                label="Password"
                type="password"
                placeholder="Enter password"
              />
            </>
          )}
          <FormField
            name="name"
            label="Name"
            type="text"
            placeholder="Enter caretaker name"
          />
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="Enter email address"
          />
          <FormField
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            placeholder="+1 234-567-8900"
          />
          <Form.Group className="mb-3">
            <Form.Label>Specialization</Form.Label>
            <Field
              as={Form.Select}
              name="specialization"
              isInvalid={touched.specialization && errors.specialization}
            >
              <option value="">Select specialization</option>
              <option value="Large Mammals">Large Mammals</option>
              <option value="Small Mammals">Small Mammals</option>
              <option value="Birds">Birds</option>
              <option value="Reptiles">Reptiles</option>
              <option value="Amphibians">Amphibians</option>
              <option value="Marine Animals">Marine Animals</option>
              <option value="Veterinary">Veterinary</option>
            </Field>
            <Form.Control.Feedback type="invalid">
              {errors.specialization}
            </Form.Control.Feedback>
          </Form.Group>
          <SubmitButton
            isSubmitting={isSubmitting || formikSubmitting}
            onCancel={onCancel}
            submitText={caretaker ? 'Update Caretaker' : 'Add Caretaker'}
          />
        </Form>
      )}
    </Formik>
  );
};

export default CaretakerForm; 