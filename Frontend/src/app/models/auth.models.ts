export interface Utilisateur {
  _id: string;
  pseudonyme: string;
  email: string;
  role?: string;
  [key: string]: unknown;
}

export interface AuthData {
  user: Utilisateur;
  token: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  type_error: string;
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface LoginPayload {
  email: string;
  motDePasse: string;
}

export interface RegisterPayload {
  pseudonyme: string;
  email: string;
  motDePasse: string;
}