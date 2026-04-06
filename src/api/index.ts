const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }

    throw new Error(response.error || 'Login failed');
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }

    throw new Error(response.error || 'Registration failed');
  }

  // Todo endpoints
  async getTodos(): Promise<Todo[]> {
    const response = await this.request<Todo[]>('/todos');
    return response.data || [];
  }

  async createTodo(text: string): Promise<Todo> {
    const response = await this.request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to create todo');
  }

  async updateTodo(id: number, updates: Partial<Pick<Todo, 'text' | 'completed'>>): Promise<Todo> {
    const response = await this.request<Todo>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to update todo');
  }

  async deleteTodo(id: number): Promise<void> {
    const response = await this.request(`/todos/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete todo');
    }
  }
}

export const apiClient = new ApiClient();
