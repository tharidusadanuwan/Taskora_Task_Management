export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
}