import { User } from '../../types/models';

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthStrategy {
  authenticate(credentials: Credentials): Promise<User>;
  register(userData: Omit<User, 'id'>): Promise<User>;
}

export class JwtAuthStrategy implements AuthStrategy {
  async authenticate(credentials: Credentials): Promise<User> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    return data.user;
  }

  async register(userData: Omit<User, 'id'>): Promise<User> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    return data.user;
  }
}

export class BasicAuthStrategy implements AuthStrategy {
  async authenticate(credentials: Credentials): Promise<User> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${credentials.email}:${credentials.password}`)}`,
      },
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    return data.user;
  }

  async register(userData: Omit<User, 'id'>): Promise<User> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    return data.user;
  }
} 