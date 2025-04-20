import React from 'react';
import { Form } from 'react-bootstrap';
import { useField } from 'formik';

interface FormFieldProps {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type,
  placeholder,
  disabled = false
}) => {
  const [field, meta] = useField(name);

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      {type === 'textarea' ? (
        <Form.Control
          as="textarea"
          rows={3}
          {...field}
          placeholder={placeholder}
          isInvalid={meta.touched && !!meta.error}
          disabled={disabled}
        />
      ) : (
        <Form.Control
          type={type}
          {...field}
          placeholder={placeholder}
          isInvalid={meta.touched && !!meta.error}
          disabled={disabled}
        />
      )}
      <Form.Control.Feedback type="invalid">
        {meta.error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default FormField; 