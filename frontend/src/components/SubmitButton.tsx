import React from 'react';
import { Button } from 'react-bootstrap';

interface SubmitButtonProps {
  isSubmitting: boolean;
  onCancel: () => void;
  submitText: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  onCancel,
  submitText
}) => {
  return (
    <div className="d-flex justify-content-between mt-4">
      <Button
        variant="secondary"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : submitText}
      </Button>
    </div>
  );
};

export default SubmitButton; 