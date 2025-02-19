import { HTTPTransport } from "../utils/xhr";
import { BASE_URL } from "./url-api";

type RequestOptions = {
  headers?: Record<string, string>;
  data?: Record<string, any> | null;
  timeout?: number;
}

export class BaseAPI {
  private readonly baseUrl: string;
  private readonly HTTP: HTTPTransport;
  private readonly path: string;

  constructor(path: string) {
    this.baseUrl = BASE_URL;
    this.HTTP = new HTTPTransport();
    this.path = path;
  }

  protected get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.HTTP.get(this.baseUrl + this.path + endpoint, options) as Promise<T>;
  }

  protected post<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.HTTP.post(this.baseUrl + this.path + endpoint, options) as Promise<T>;
  }

  protected put<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.HTTP.put(this.baseUrl + this.path + endpoint, options) as Promise<T>;
  }

  protected delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.HTTP.delete(this.baseUrl + this.path + endpoint, options) as Promise<T>;
  }
}
