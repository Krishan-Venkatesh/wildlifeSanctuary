import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Card, Spinner, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { caretakersAPI, animalsAPI, authAPI } from '../services/api';
import { Caretaker, Animal } from '../types/models';
import CaretakerForm from '../components/CaretakerForm';
import { toast } from 'react-hot-toast';

const Caretakers: React.FC = () => {
  const { user } = useAuth();
  const [caretakers, setCaretakers] = useState<Caretaker[]>([]);
  const [assignedAnimals, setAssignedAnimals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedCaretaker, setSelectedCaretaker] = useState<Caretaker | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [caretakersData, animalsData] = await Promise.all([
        caretakersAPI.getAll(),
        animalsAPI.getAll()
      ]);

      setCaretakers(caretakersData);
      
      // Count animals per caretaker
      const counts = animalsData.reduce((acc, animal) => {
        if (animal.caretakerId) {
          acc[animal.caretakerId] = (acc[animal.caretakerId] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
      
      setAssignedAnimals(counts);
    } catch (err) {
      setError('Failed to load caretakers data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    console.log('Add button clicked'); // Debug log
    setSelectedCaretaker(null);
    setShowModal(true);
  };

  const handleEdit = (caretaker: Caretaker) => {
    setSelectedCaretaker(caretaker);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (assignedAnimals[id] > 0) {
      toast.error('Cannot delete caretaker with assigned animals');
      return;
    }

    if (window.confirm('Are you sure you want to delete this caretaker?')) {
      try {
        await caretakersAPI.delete(id);
        setCaretakers(caretakers.filter(caretaker => caretaker.id !== id));
        toast.success('Caretaker deleted successfully');
      } catch (err) {
        setError('Failed to delete caretaker');
        console.error('Error deleting caretaker:', err);
      }
    }
  };

  const handleSubmit = async (data: Partial<Caretaker> & { username: string; password: string }) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!data.username || !data.password || !data.email) {
        toast.error('Please fill in all required fields');
        return;
      }

      // First create the user account
      const userResponse = await authAPI.register({
        username: data.username,
        password: data.password,
        email: data.email,
        role: 'CARETAKER'
      });

      // Then create the caretaker record
      const caretakerData = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        specialization: data.specialization,
        userId: userResponse.id, // Link to the created user
        assignedAnimalIds: [] // Initialize with empty array
      };

      const createdCaretaker = await caretakersAPI.create(caretakerData);
      setCaretakers([...caretakers, createdCaretaker]);
      setShowModal(false);
      toast.success('Caretaker added successfully');
    } catch (err: any) {
      console.error('Error adding caretaker:', err);
      if (err.response?.status === 409) {
        toast.error('Username or email already exists');
      } else {
        toast.error('Failed to add caretaker. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container fluid className="container-fluid">
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="container-fluid">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="container-fluid">
      <div className="page-header d-flex justify-content-between align-items-center">
        <h1>Caretakers</h1>
        {user?.role === 'MANAGER' && (
          <Button 
            variant="primary" 
            onClick={handleAdd}
            className="add-caretaker-btn"
          >
            <FaPlus className="me-2" />
            Add Caretaker
          </Button>
        )}
      </div>

      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Assigned Animals</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {caretakers.map(caretaker => (
                  <tr key={caretaker.id}>
                    <td>{caretaker.name}</td>
                    <td>{caretaker.email}</td>
                    <td>{caretaker.phoneNumber}</td>
                    <td>{caretaker.specialization}</td>
                    <td>{assignedAnimals[caretaker.id] || 0} animals</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(caretaker)}
                      >
                        <FaEdit />
                      </Button>
                      {user?.role === 'MANAGER' && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(caretaker.id)}
                          disabled={assignedAnimals[caretaker.id] > 0}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCaretaker ? 'Edit Caretaker' : 'Add New Caretaker'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CaretakerForm
            caretaker={selectedCaretaker || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setShowModal(false)}
            isSubmitting={isSubmitting}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Caretakers; 