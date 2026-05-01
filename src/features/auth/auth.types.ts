export interface LoginPayload {
  email: string;
  password: string;
}

export interface ProfilePicture {
  _id: string;
  fileName: string;
  key: string;
  mimetype: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  _id: string;
  email: string;
  name: string;
  profilePicture?: ProfilePicture;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  resetToken: string;
}

export interface UpdatePasswordPayload {
  resetToken: string;
  password: string;
}
