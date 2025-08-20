import { buildApiUrl, getDefaultHeaders, handleApiError } from '../config/api';

export interface User {
  id: string;
  name: string;
  email: string;
  apps: UserApp[];
}

export interface UserApp {
  app: string;
  role: string;
  token: string;
  code: string;
  code_expliration: string;
  status: string;
  is_session_active: boolean;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  apps: {
    role: string;
    app: string;
  }[];
}

export interface UpdateUserRequest {
  app_id: string;
  status: string;
  role: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordChangeRequest {
  user_email: string;
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface VerificationRequest {
  user_email: string;
  verification_code: number;
}

export class UserService {
  // Create new user
  static async createUser(userData: CreateUserRequest): Promise<void> {
    const response = await fetch(buildApiUrl('/user/enrollment'), {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }
  }

  // Get all users
  static async getAllUsers(appId?: string): Promise<User[]> {
    const url = appId 
      ? buildApiUrl(`/user?app_id=${appId}`)
      : buildApiUrl('/user');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return data.data || [];
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User> {
    const response = await fetch(buildApiUrl(`/user/${id}`), {
      method: 'GET',
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return data.data;
  }

  // Update user
  static async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await fetch(buildApiUrl(`/user/${id}`), {
      method: 'PATCH',
      headers: getDefaultHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return data.data;
  }

  // Request password reset
  static async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(buildApiUrl('/user/password'), {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      await handleApiError(response);
    }
  }

  // Change password
  static async changePassword(passwordData: PasswordChangeRequest): Promise<void> {
    const response = await fetch(buildApiUrl('/user/password'), {
      method: 'PUT',
      headers: getDefaultHeaders(),
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }
  }

  // Verify user
  static async verifyUser(verificationData: VerificationRequest): Promise<void> {
    const response = await fetch(buildApiUrl('/user/verification'), {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify(verificationData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }
  }
}
