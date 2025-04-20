import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Badge, Card } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { habitatsAPI, animalsAPI } from '../services/api';
import { Habitat, Animal } from '../types/models';
import HabitatForm from '../components/HabitatForm';
import { toast } from 'react-hot-toast';

const Habitats: React.FC = () => {
  const { user } = useAuth();
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [animalCounts, setAnimalCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedHabitat, setSelectedHabitat] = useState<Habitat | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [habitatsData, animalsData] = await Promise.all([
        habitatsAPI.getAll(),
        animalsAPI.getAll()
      ]);

      setHabitats(habitatsData);
      
      // Count animals per habitat
      const counts = animalsData.reduce((acc, animal) => {
        acc[animal.habitatId] = (acc[animal.habitatId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      setAnimalCounts(counts);
    } catch (err) {
      setError('Failed to load habitats data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedHabitat(null);
    setShowModal(true);
  };

  const handleEdit = (habitat: Habitat) => {
    setSelectedHabitat(habitat);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (animalCounts[id] > 0) {
      alert('Cannot delete habitat that contains animals. Please relocate animals first.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this habitat?')) {
      try {
        await habitatsAPI.delete(id);
        setHabitats(habitats.filter(habitat => habitat.id !== id));
      } catch (err) {
        setError('Failed to delete habitat');
      }
    }
  };

  const handleSubmit = async (data: Partial<Habitat>) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Check if the ID already exists when adding a new habitat
      if (!selectedHabitat) {
        const existingHabitat = habitats.find(habitat => habitat.id === data.id);
        if (existingHabitat) {
          toast.error('A habitat with this ID already exists');
          return;
        }
      }

      let updatedHabitat: Habitat;

      if (selectedHabitat) {
        updatedHabitat = await habitatsAPI.update(selectedHabitat.id, data);
        setHabitats(habitats.map(habitat => 
          habitat.id === selectedHabitat.id ? updatedHabitat : habitat
        ));
      } else {
        updatedHabitat = await habitatsAPI.create(data as Omit<Habitat, 'id'>);
        setHabitats([...habitats, updatedHabitat]);
      }

      setShowModal(false);
      toast.success(selectedHabitat ? 'Habitat updated successfully' : 'Habitat added successfully');
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error('A habitat with this ID already exists');
      } else {
        setError('Failed to save habitat. Please try again later.');
        console.error('Error saving habitat:', err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container fluid className="container-fluid">
        <div>Loading...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="container-fluid">
        <div className="text-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container fluid className="container-fluid">
      <div className="d-flex justify-content-between align-items-center page-header">
        <h2>Habitats</h2>
        {user?.role === 'MANAGER' && (
          <Button variant="primary" onClick={handleAdd}>
            <FaPlus className="me-2" />
            Add Habitat
          </Button>
        )}
      </div>

      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Climate</th>
                  <th>Area (m²)</th>
                  <th>Animals</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {habitats.map((habitat) => (
                  <tr key={habitat.id}>
                    <td>{habitat.id}</td>
                    <td>{habitat.name}</td>
                    <td>{habitat.type}</td>
                    <td>{habitat.climate}</td>
                    <td>{habitat.area.toLocaleString()}</td>
                    <td>{animalCounts[habitat.id] || 0} animals</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(habitat)}
                      >
                        <FaEdit />
                      </Button>
                      {user?.role === 'MANAGER' && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(habitat.id)}
                          disabled={(animalCounts[habitat.id] || 0) > 0}
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
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedHabitat ? 'Edit Habitat' : 'Add New Habitat'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HabitatForm
            habitat={selectedHabitat || undefined}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Habitats; 