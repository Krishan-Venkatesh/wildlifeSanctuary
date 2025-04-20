import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { DashboardStats } from '../types/models';
import { FaPaw, FaTree, FaUserNurse } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStatistics();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
      <h2 className="mb-4">Welcome, {user?.username}!</h2>
      
      <Row className="g-4">
        <Col sm={12} md={4}>
          <Card className="h-100 stats-card">
            <Card.Body className="text-center">
              <div className="display-4 mb-3">
                <FaPaw className="text-primary" />
              </div>
              <Card.Title>Total Animals</Card.Title>
              <div className="display-6">{stats?.totalAnimals || 0}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={12} md={4}>
          <Card className="h-100 stats-card">
            <Card.Body className="text-center">
              <div className="display-4 mb-3">
                <FaTree className="text-success" />
              </div>
              <Card.Title>Total Habitats</Card.Title>
              <div className="display-6">{stats?.totalHabitats || 0}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={12} md={4}>
          <Card className="h-100 stats-card">
            <Card.Body className="text-center">
              <div className="display-4 mb-3">
                <FaUserNurse className="text-info" />
              </div>
              <Card.Title>Total Caretakers</Card.Title>
              <div className="display-6">{stats?.totalCaretakers || 0}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title className="mb-3">Quick Actions</Card.Title>
              <div>
                {user?.role === 'MANAGER' ? (
                  <>
                    <div className="mb-2">As a manager, you can:</div>
                    <ul className="list-unstyled">
                      <li className="mb-2">• Manage animals and their habitats</li>
                      <li className="mb-2">• Assign caretakers to animals</li>
                      <li className="mb-2">• View and manage all sanctuary operations</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <div className="mb-2">As a caretaker, you can:</div>
                    <ul className="list-unstyled">
                      <li className="mb-2">• View assigned animals</li>
                      <li className="mb-2">• Update animal health status</li>
                      <li className="mb-2">• View habitat information</li>
                    </ul>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 