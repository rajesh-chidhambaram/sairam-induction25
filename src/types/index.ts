// User related types
export interface UserDetails {
  id: string;
  name: string;
  parentCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface VerifyIdResponse extends ApiResponse {
  details: UserDetails;
}

export interface UpdateCountResponse extends ApiResponse {
  parentCount: number;
}

// Form related types
export interface AdmissionFormData {
  admissionId: string;
}

export interface AccompanyingCountFormData {
  accompanyingCount: number;
}

// Component Props types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export interface AlertProps {
  type?: "error" | "success" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

// Hook types
export interface UseInductionFormReturn {
  verified: boolean;
  userDetails: UserDetails;
  loading: boolean;
  error: string;
  successMessage: string;
  verifyId: (id: string) => Promise<void>;
  updateAccompanyingCount: (count: number) => Promise<void>;
  resetForm: () => void;
  clearMessages: () => void;
}

// Database/Model types
export interface UserDetailsDocument extends UserDetails {
  _id?: string;
  __v?: number;
  toResponseJSON(): UserDetails;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Environment types
export interface ProcessEnv {
  MONGODB_URI: string;
  DATABASE_NAME: string;
  NODE_ENV: "development" | "production" | "test";
}