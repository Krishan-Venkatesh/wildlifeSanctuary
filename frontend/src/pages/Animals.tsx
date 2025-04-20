import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Badge, Card, Spinner, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { animalsAPI, habitatsAPI, caretakersAPI } from '../services/api';
import { Animal, Habitat, Caretaker } from '../types/models';
import AnimalForm from '../components/AnimalForm';
import { toast } from 'react-hot-toast';

// Types for component props
interface AnimalsTableProps {
  animals: Animal[];
  habitats: Habitat[];
  caretakers: Caretaker[];
  onEdit: (animal: Animal) => void;
  onDelete: (id: string) => void;
  userRole?: string;
}

// Separate component for the animals table
const AnimalsTable: React.FC<AnimalsTableProps> = ({
  animals,
  habitats,
  caretakers,
  onEdit,
  onDelete,
  userRole
}) => (
  <Card>
    <Card.Body>
      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Species</th>
              <th>Habitat</th>
              <th>Date of Birth</th>
              <th>Health Status</th>
              <th>Caretaker</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {animals.map((animal) => (
              <tr key={animal.id}>
                <td>{animal.id}</td>
                <td>{animal.name}</td>
                <td>{animal.species}</td>
                <td>
                  {habitats.find((h) => h.id === animal.habitatId)?.name || 'Unknown'}
                </td>
                <td>{new Date(animal.dateOfBirth).toLocaleDateString()}</td>
                <td>
                  <Badge bg={animal.healthStatus === 'Healthy' ? 'success' : 'danger'}>
                    {animal.healthStatus}
                  </Badge>
                </td>
                <td>
                  {caretakers.find((c) => c.id === animal.caretakerId)?.name || 'Unknown'}
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => onEdit(animal)}
                  >
                    <FaEdit />
                  </Button>
                  {userRole === 'MANAGER' && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDelete(animal.id)}
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
);

const Animals: React.FC = () => {
  const { user } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [caretakers, setCaretakers] = useState<Caretaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    habitats: Habitat[];
    caretakers: Caretaker[];
  } | null>(null);
  const [isFormDataLoading, setIsFormDataLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get habitats and caretakers first
      const [habitatsData, caretakersData] = await Promise.all([
        habitatsAPI.getAll(),
        caretakersAPI.getAll()
      ]);
      setHabitats(habitatsData);
      setCaretakers(caretakersData);

      // Get animals based on user role
      let animalsData: Animal[];
      if (user?.role === 'CARETAKER') {
        try {
          // Find the caretaker by userId (which matches the user's _id)
          const caretaker = caretakersData.find(c => c.userId === user.id);
          if (!caretaker) {
            setError('Caretaker profile not found. Please contact the manager.');
            setAnimals([]);
            return;
          }
          
          // Get animals for this caretaker using their _id
          animalsData = await animalsAPI.getByCaretakerId(caretaker.id);
        } catch (err) {
          console.error('Error fetching caretaker data:', err);
          setError('Failed to load caretaker profile. Please try again later.');
          setAnimals([]);
          return;
        }
      } else {
        animalsData = await animalsAPI.getAll();
      }
      
      setAnimals(animalsData);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    try {
      setIsFormDataLoading(true);
      const [habitatsData, caretakersData] = await Promise.all([
        habitatsAPI.getAll(),
        caretakersAPI.getAll()
      ]);
      setFormData({ habitats: habitatsData, caretakers: caretakersData });
      setSelectedAnimal(null);
      setShowModal(true);
    } catch (error) {
      console.error('Error loading form data:', error);
      toast.error('Failed to load form data');
    } finally {
      setIsFormDataLoading(false);
    }
  };

  const handleEdit = async (animal: Animal) => {
    try {
      setIsFormDataLoading(true);
      const [habitatsData, caretakersData] = await Promise.all([
        habitatsAPI.getAll(),
        caretakersAPI.getAll()
      ]);
      setFormData({ habitats: habitatsData, caretakers: caretakersData });
      setSelectedAnimal(animal);
      setShowModal(true);
    } catch (error) {
      console.error('Error loading form data:', error);
      toast.error('Failed to load form data');
    } finally {
      setIsFormDataLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      try {
        await animalsAPI.delete(id);
        setAnimals(animals.filter(animal => animal.id !== id));
        toast.success('Animal deleted successfully');
      } catch (err) {
        setError('Failed to delete animal. Please try again later.');
        console.error('Error deleting animal:', err);
      }
    }
  };

  const handleSubmit = async (data: Partial<Animal>) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Check if the ID already exists when adding a new animal
      if (!selectedAnimal) {
        const existingAnimal = animals.find(animal => animal.id === data.id);
        if (existingAnimal) {
          toast.error('An animal with this ID already exists');
          return;
        }
      }

      let updatedAnimal: Animal;

      if (selectedAnimal) {
        updatedAnimal = await animalsAPI.update(selectedAnimal.id, data);
        setAnimals(animals.map(animal => 
          animal.id === selectedAnimal.id ? updatedAnimal : animal
        ));
      } else {
        updatedAnimal = await animalsAPI.create(data as Omit<Animal, 'id'>);
        setAnimals([...animals, updatedAnimal]);
      }

      setShowModal(false);
      toast.success(selectedAnimal ? 'Animal updated successfully' : 'Animal added successfully');
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error('An animal with this ID already exists');
      } else {
        setError('Failed to save animal. Please try again later.');
        console.error('Error saving animal:', err);
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
        <h1>Animals</h1>
        {user?.role === 'MANAGER' && (
          <Button variant="primary" onClick={handleAdd}>
            <FaPlus className="me-2" />
            Add Animal
          </Button>
        )}
      </div>

      <AnimalsTable
        animals={animals}
        habitats={habitats}
        caretakers={caretakers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        userRole={user?.role}
      />

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedAnimal ? 'Edit Animal' : 'Add New Animal'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isFormDataLoading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : formData ? (
            <AnimalForm
              animal={selectedAnimal}
              habitats={formData.habitats}
              caretakers={formData.caretakers}
              onSubmit={handleSubmit}
              onCancel={() => setShowModal(false)}
              isSubmitting={isSubmitting}
            />
          ) : (
            <div className="text-center text-danger">
              Failed to load form data
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Animals; 