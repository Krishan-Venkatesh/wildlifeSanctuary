import React from 'react';
import { Form } from 'react-bootstrap';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Habitat } from '../types/models';
import FormField from './FormField';
import SubmitButton from './SubmitButton';

interface HabitatFormProps {
  habitat?: Habitat;
  onSubmit: (data: Partial<Habitat>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const validationSchema = Yup.object().shape({
  id: Yup.string()
    .required('ID is required')
    .matches(/^[a-zA-Z0-9]+$/, 'ID can only contain letters and numbers')
    .min(3, 'ID must be at least 3 characters')
    .max(20, 'ID must be at most 20 characters'),
  name: Yup.string().required('Name is required'),
  type: Yup.string().required('Type is required'),
  description: Yup.string().required('Description is required'),
  area: Yup.number()
    .required('Area is required')
    .positive('Area must be positive'),
  climate: Yup.string().required('Climate is required')
});

const HabitatForm: React.FC<HabitatFormProps> = ({
  habitat,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const initialValues: Partial<Habitat> = {
    id: habitat?.id || '',
    name: habitat?.name || '',
    type: habitat?.type || '',
    description: habitat?.description || '',
    area: habitat?.area || 0,
    climate: habitat?.climate || ''
  };

  const handleSubmit = async (
    values: Partial<Habitat>,
    { setSubmitting }: FormikHelpers<Partial<Habitat>>
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
      {({ handleSubmit, isSubmitting: formikSubmitting }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <FormField
            name="id"
            label="ID"
            type="text"
            placeholder="Enter unique habitat ID (e.g., SAV001)"
            disabled={!!habitat}
          />
          <Form.Text className="text-muted mb-3">
            {habitat 
              ? "ID cannot be changed once created"
              : "Enter a unique ID that will identify this habitat. This cannot be changed later."}
          </Form.Text>
          <FormField
            name="name"
            label="Name"
            type="text"
            placeholder="Enter habitat name"
          />
          <FormField
            name="type"
            label="Type"
            type="text"
            placeholder="Enter habitat type"
          />
          <FormField
            name="description"
            label="Description"
            type="textarea"
            placeholder="Enter habitat description"
          />
          <FormField
            name="area"
            label="Area (m²)"
            type="number"
            placeholder="Enter habitat area"
          />
          <FormField
            name="climate"
            label="Climate"
            type="text"
            placeholder="Enter habitat climate"
          />
          <SubmitButton
            isSubmitting={isSubmitting || formikSubmitting}
            onCancel={onCancel}
            submitText={habitat ? 'Update Habitat' : 'Add Habitat'}
          />
        </Form>
      )}
    </Formik>
  );
};

export default HabitatForm; 