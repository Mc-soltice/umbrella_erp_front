// src/utils/apiHelpers.ts
export interface ApiResponse<T> {
  data: T;
  status?: number;
  message?: string;
}

export const extractData = <T>(response: ApiResponse<T>): T => {
  return response.data;
};