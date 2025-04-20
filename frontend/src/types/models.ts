export interface User {
  id: string;
  username: string;
  role: 'MANAGER' | 'CARETAKER';
  token?: string;
}

export interface Animal {
  id: string;
  name: string;
  species: string;
  habitatId: string;
  dateOfBirth: string;
  healthStatus: string;
  caretakerId: string;
  description: string;
}

export interface Habitat {
  id: string;
  name: string;
  type: string;
  description: string;
  area: number;
  climate: string;
  animalIds: string[];
}

export interface Caretaker {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  userId: string;
  assignedAnimalIds: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  totalAnimals: number;
  totalHabitats: number;
  totalCaretakers: number;
}

export interface AuthResponse {
  token: string;
  id: string;
  username: string;
  role: 'MANAGER' | 'CARETAKER';
} 