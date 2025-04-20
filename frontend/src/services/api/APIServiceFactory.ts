import { AnimalService } from './AnimalService';
import { CaretakerService } from './CaretakerService';
import { HabitatService } from './HabitatService';
import { AuthService } from './AuthService';
import { JwtAuthStrategy } from '../auth/AuthStrategy';

export class APIServiceFactory {
  private static instance: APIServiceFactory;
  private baseURL: string;

  private constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  public static getInstance(baseURL?: string): APIServiceFactory {
    if (!APIServiceFactory.instance) {
      APIServiceFactory.instance = new APIServiceFactory(baseURL);
    }
    return APIServiceFactory.instance;
  }

  public createAnimalService(): AnimalService {
    return new AnimalService(this.baseURL);
  }

  public createCaretakerService(): CaretakerService {
    return new CaretakerService(this.baseURL);
  }

  public createHabitatService(): HabitatService {
    return new HabitatService(this.baseURL);
  }

  public createAuthService(): AuthService {
    return new AuthService(this.baseURL, new JwtAuthStrategy());
  }
} 