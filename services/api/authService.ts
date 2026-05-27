import type { LoginRequest, SignupRequest, ForgotPasswordRequest, ResetPasswordRequest, UserProfile } from '@/types/auth';

const STORAGE_KEY = 'mayar_user';

export const authService = {
  async loginWithEmail(data: LoginRequest): Promise<{ success: boolean; user?: UserProfile; message: string }> {
    await new Promise((r) => setTimeout(r, 800));

    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      return { success: false, message: 'Invalid email address' };
    }
    if (!data.password || data.password.length < 8) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Mock: accept any valid email/password combination
    const user: UserProfile = {
      id: 'usr_' + Date.now(),
      fullName: 'Mayar User',
      phone: '',
      email: data.email,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return { success: true, user, message: 'Login successful' };
  },

  async signup(data: SignupRequest): Promise<{ success: boolean; user?: UserProfile; message: string }> {
    await new Promise((r) => setTimeout(r, 800));

    const user: UserProfile = {
      id: 'usr_' + Date.now(),
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      country: data.country,
      pinCode: data.pinCode,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return { success: true, user, message: 'Account created' };
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 800));

    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      return { success: false, message: 'Invalid email address' };
    }
    return { success: true, message: 'If an account exists with this email, a reset link has been sent.' };
  },

  async resetPassword(data: ResetPasswordRequest): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 800));

    if (!data.password || data.password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters' };
    }
    return { success: true, message: 'Password reset successfully. You can now login.' };
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  },
};
