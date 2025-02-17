export interface ErrorResponse {
    type: string;
    title: string;
    status: number;
    errors?: { [key: string]: string[] };
  }