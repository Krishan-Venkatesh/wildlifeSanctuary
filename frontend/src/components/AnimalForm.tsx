import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Animal, Habitat, Caretaker } from '../types/models';

interface AnimalFormProps {
  animal?: Animal;
  habitats: Habitat[];
  caretakers: Caretaker[];
  onSubmit: (data: Partial<Animal>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const AnimalForm: React.FC<AnimalFormProps> = ({
  animal,
  habitats,
  caretakers,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const initialValues: Partial<Animal> = {
    id: animal?.id || '',
    name: animal?.name || '',
    species: animal?.species || '',
    habitatId: animal?.habitatId || '',
    dateOfBirth: animal?.dateOfBirth || '',
    healthStatus: animal?.healthStatus || 'Healthy',
    caretakerId: animal?.caretakerId || '',
    description: animal?.description || ''
  };

  const validationSchema = Yup.object().shape({
    id: Yup.string().required('Animal ID is required'),
    name: Yup.string().required('Name is required'),
    species: Yup.string().required('Species is required'),
    habitatId: Yup.string().required('Habitat is required'),
    dateOfBirth: Yup.string().required('Date of Birth is required'),
    healthStatus: Yup.string().required('Health Status is required'),
    caretakerId: Yup.string().required('Caretaker is required'),
    description: Yup.string().required('Description is required')
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, errors, touched }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Animal ID</Form.Label>
            <Field
              as={Form.Control}
              type="text"
              name="id"
              placeholder="Enter animal ID"
              isInvalid={touched.id && errors.id}
            />
            <Form.Control.Feedback type="invalid">
              {errors.id}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Field
              as={Form.Control}
              type="text"
              name="name"
              placeholder="Enter animal name"
              isInvalid={touched.name && errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Species</Form.Label>
            <Field
              as={Form.Control}
              type="text"
              name="species"
              placeholder="Enter species"
              isInvalid={touched.species && errors.species}
            />
            <Form.Control.Feedback type="invalid">
              {errors.species}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Habitat</Form.Label>
            <Field
              as={Form.Select}
              name="habitatId"
              isInvalid={touched.habitatId && errors.habitatId}
            >
              <option value="">Select a habitat</option>
              {habitats.map((habitat) => (
                <option key={habitat.id} value={habitat.id}>
                  {habitat.name}
                </option>
              ))}
            </Field>
            <Form.Control.Feedback type="invalid">
              {errors.habitatId}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Field
              as={Form.Control}
              type="date"
              name="dateOfBirth"
              isInvalid={touched.dateOfBirth && errors.dateOfBirth}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateOfBirth}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Health Status</Form.Label>
            <Field
              as={Form.Select}
              name="healthStatus"
              isInvalid={touched.healthStatus && errors.healthStatus}
            >
              <option value="Healthy">Healthy</option>
              <option value="Sick">Sick</option>
              <option value="Critical">Critical</option>
            </Field>
            <Form.Control.Feedback type="invalid">
              {errors.healthStatus}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Caretaker</Form.Label>
            <Field
              as={Form.Select}
              name="caretakerId"
              isInvalid={touched.caretakerId && errors.caretakerId}
            >
              <option value="">Select a caretaker</option>
              {caretakers.map((caretaker) => (
                <option key={caretaker.id} value={caretaker.id}>
                  {caretaker.name}
                </option>
              ))}
            </Field>
            <Form.Control.Feedback type="invalid">
              {errors.caretakerId}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Field
              as={Form.Control}
              name="description"
              placeholder="Enter description"
              isInvalid={touched.description && errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : animal ? 'Update' : 'Add'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AnimalForm; 