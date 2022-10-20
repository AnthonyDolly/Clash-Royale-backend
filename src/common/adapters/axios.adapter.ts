import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private readonly axios: AxiosInstance = axios;

  async get<T>(url: string, options?: any): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url, options);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
