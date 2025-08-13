# Wildlife Sanctuary Management System

## Architecture

### Layered Architecture
The application follows a layered architecture pattern:

1. **Presentation Layer (Frontend)**
   - React components for UI
   - Context API for state management
   - React Router for navigation
   - Bootstrap for styling

2. **Application Layer (Backend)**
   - Spring Boot controllers
   - Service layer for business logic
   - DTOs for data transfer

3. **Domain Layer**
   - Entity models (Animal, Caretaker, Habitat, User)
   - Repository interfaces
   - Business rules and validations

4. **Infrastructure Layer**
   - MongoDB integration
   - Security configuration
   - External service integrations
  
**My Contributions**

I contributed to both the frontend and backend development of the project.

**Frontend**
- Developed `AnimalForm.tsx` for adding animal records
- Created `AnimalList.tsx` for displaying and filtering animals
- Implemented state management using React Context API
- Set up navigation with React Router
- Styled components with Bootstrap

**Backend**
- Implemented the caretaker module with entity definitions and relationships
- Built REST APIs for caretaker operations (add, list, assign)
- Added service layer logic for caretaker assignment and validation
- Applied the Repository Pattern for data access via `CaretakerRepository`
- Integrated caretaker APIs with the frontend


## Design Principles


### SOLID Principles

1. **Single Responsibility Principle (SRP)**
   - Each component has a single responsibility
   - Services are focused on specific domains
   - Clear separation of concerns
   - **Example**: `AnimalForm.tsx` handles only form display and submission, while `AnimalList.tsx` manages only the list display

2. **Open/Closed Principle (OCP)**
   - Repository interfaces allow for extension
   - Component props are properly typed
   - Services can be extended without modification
   - **Example**: `APIServiceFactory.ts` allows adding new services without modifying existing code, and `AuthStrategy.ts` supports multiple authentication methods

3. **Liskov Substitution Principle (LSP)**
   - Base interfaces define contracts
   - Implementations can be substituted
   - Consistent behavior across implementations
   - **Example**: `JwtAuthStrategy.ts` and `BasicAuthStrategy.ts` can be used interchangeably as they both implement the `AuthStrategy` interface

4. **Interface Segregation Principle (ISP)**
   - Fine-grained interfaces
   - Clients only depend on methods they use
   - Reduced coupling
   - **Example**: Separate interfaces for `AnimalOperations` (feeding, cleaning) and `MedicalOperations` (health checks, medicine) in our service layer

5. **Dependency Inversion Principle (DIP)**
   - Dependencies on abstractions
   - Inversion of control
   - Loose coupling
   - **Example**: Components depend on service interfaces rather than concrete implementations, and `AuthContext.tsx` depends on the `AuthStrategy` interface


## Design Patterns

### 1. Repository Pattern
```typescript
// Frontend API services
interface AnimalRepository {
  getAll(): Promise<Animal[]>;
  getById(id: string): Promise<Animal>;
  create(animal: Animal): Promise<Animal>;
  update(id: string, animal: Animal): Promise<Animal>;
  delete(id: string): Promise<void>;
}
```

### 2. Factory Pattern
```typescript
// API service factory
class APIServiceFactory {
  static createAnimalService(): AnimalService {
    return new AnimalService();
  }
  
  static createCaretakerService(): CaretakerService {
    return new CaretakerService();
  }
}
```

### 3. Observer Pattern
```typescript
// Context for state management
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {}
});
```

### 4. Strategy Pattern
```typescript
// Authentication strategies
interface AuthStrategy {
  authenticate(credentials: Credentials): Promise<User>;
}

class JwtAuthStrategy implements AuthStrategy {
  async authenticate(credentials: Credentials): Promise<User> {
    // JWT authentication implementation
  }
}

class BasicAuthStrategy implements AuthStrategy {
  async authenticate(credentials: Credentials): Promise<User> {
    // Basic authentication implementation
  }
}
```

### 5. Decorator Pattern
```typescript
// Component enhancement
const withLoading = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const [loading, setLoading] = useState(false);
    // Loading logic
    return loading ? <Spinner /> : <WrappedComponent {...props} />;
  };
};
```

## Implementation Examples

### Repository Pattern Implementation
```typescript
// Backend repository
@Repository
public interface AnimalRepository extends MongoRepository<Animal, String> {
    List<Animal> findByCaretakerId(String caretakerId);
    List<Animal> findByHabitatId(String habitatId);
}
```

### Factory Pattern Implementation
```typescript
// Service factory
@Component
public class ServiceFactory {
    @Autowired
    private AnimalRepository animalRepository;
    
    public AnimalService createAnimalService() {
        return new AnimalService(animalRepository);
    }
}
```
### Observer Pattern Implementation
```typescript
// Frontend context
export const AuthProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    
    const login = async (credentials: Credentials) => {
        // Login logic
        setUser(authenticatedUser);
    };
    
    return (
        <AuthContext.Provider value={{ user, login }}>
            {children}
        </AuthContext.Provider>
    );
};
```
## Best Practices

1. **Code Organization**
   - Clear folder structure
   - Separation of concerns
   - Consistent naming conventions

2. **Type Safety**
   - TypeScript for frontend
   - Strong typing in Java
   - Proper interface definitions

3. **Error Handling**
   - Consistent error handling
   - Proper error messages
   - Error boundaries

4. **Testing**
   - Unit tests for services
   - Component tests
   - Integration tests

5. **Security**
   - Authentication
   - Authorization
   - Input validation 

## Getting Started

### Prerequisites

Before running the project, ensure you have the following installed:
- Java 17 or higher
- Node.js 16 or higher
- MongoDB
- Maven
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/manohar-07/wildlifeSanctuary.git
   cd wildlifeSanctuary
   ```

2. **Backend Setup**
   ```bash
   # Navigate to the backend directory
   cd wildlifeSanctuary

   # Install dependencies
   mvn clean install

   # Run the Spring Boot application
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

3. **Frontend Setup**
   ```bash
   # Navigate to the frontend directory
   cd frontend

   # Install dependencies
   npm install

   # Start the development server
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

### Environment Setup

1. **Backend Configuration**
   - Create `application.properties` in `src/main/resources` with:
     ```properties
     spring.data.mongodb.uri=mongodb://localhost:27017/wildlifeSanctuary
     spring.data.mongodb.database=wildlifeSanctuary
     jwt.secret=your-secret-key
     jwt.expiration=86400000
     ```

2. **Frontend Configuration**
   - Create `.env` file in the frontend directory with:
     ```env
     VITE_API_URL=http://localhost:8080/api
     ```

### Database Setup

1. Start MongoDB service
2. The application will create necessary collections automatically

### Troubleshooting

1. **Backend Issues**
   - Ensure MongoDB is running
   - Check if port 8080 is available
   - Verify Java version is 17 or higher

2. **Frontend Issues**
   - Clear node_modules and reinstall if needed
   - Check if port 5173 is available
   - Verify Node.js version is 16 or higher

3. **Database Issues**
   - Ensure MongoDB service is running
   - Check connection string in application.properties
   - Verify database permissions

### Support

For any issues or questions, please:
1. Check the existing issues on GitHub
2. Create a new issue if needed
3. Contact the maintainers

