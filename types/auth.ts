export interface LoginRequest {
  email: string;
  password: string;
  recaptchaToken?: string;
}

export interface SignupRequest {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  pinCode: string;
  password: string;
  recaptchaToken?: string;
}

export interface ForgotPasswordRequest {
  email: string;
  recaptchaToken?: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  country?: string;
  pinCode?: string;
}
