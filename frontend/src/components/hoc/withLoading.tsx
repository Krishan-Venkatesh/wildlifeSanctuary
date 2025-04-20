import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';

interface WithLoadingProps {
  isLoading?: boolean;
}

const withLoading = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithLoading: React.FC<P & WithLoadingProps> = (props) => {
    const [loading, setLoading] = useState(false);

    const setLoadingState = (isLoading: boolean) => {
      setLoading(isLoading);
    };

    if (loading || props.isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

    return <WrappedComponent {...props} setLoading={setLoadingState} />;
  };

  return WithLoading;
};

export default withLoading; 