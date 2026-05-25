export interface ApiResponse<T> {
  status: 'success' | 'error';
  code: number;
  message?: string;
  data?: T;
  errors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}

export interface PagedData<T> {
  items: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PagedResponse<T> extends ApiResponse<PagedData<T>> {}
