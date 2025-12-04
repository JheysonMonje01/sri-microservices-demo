//src/common/interfaces/service-response.interface.ts
export interface ServiceResponse<T> {
  message: string;
  data?: T;
  error?: string;
}
