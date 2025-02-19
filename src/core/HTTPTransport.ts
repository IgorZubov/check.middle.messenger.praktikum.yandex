import { queryStringify } from "../utils/queryStringify";

const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

type Methods = (typeof METHODS)[keyof typeof METHODS];
type HTTPMethod = (url: string, options?: RequestOptions) => Promise<unknown>;

interface RequestOptions {
  headers?: Record<string, string>;
  method?: Methods;
  data?: unknown;
  timeout?: number;
}

export class HTTPTransport {
  protected API_URL = "https://ya-praktikum.tech/api/v2";

  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = `${this.API_URL}${endpoint}`;
  }
  get: HTTPMethod = (url, options = {}) => this.request(this.endpoint + url, { ...options, method: METHODS.GET }, options.timeout);
  put: HTTPMethod = (url, options = {}) => this.request(this.endpoint + url, { ...options, method: METHODS.PUT }, options.timeout);
  post: HTTPMethod = (url, options = {}) => this.request(this.endpoint + url, { ...options, method: METHODS.POST }, options.timeout);
  delete: HTTPMethod = (url, options = {}) => this.request(this.endpoint + url, { ...options, method: METHODS.DELETE }, options.timeout);

  request<Response>(url: string, options: RequestOptions = { method: METHODS.GET }, timeout: number = 5000): Promise<Response> {
    const { headers = {}, method, data } = options;

    return new Promise(function (resolve, reject) {
      if (!method) {
        reject("No method");
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;
      const requestUrl = isGet && !!data ? `${url}${queryStringify(data as Record<string, unknown>)}` : url;

      xhr.open(method, requestUrl);
      if (headers) {
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]);
        });
      }

      if (!(data instanceof FormData)) {
        xhr.setRequestHeader("Content-Type", "application/json");
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status < 400) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.onabort = reject;
      xhr.onerror = reject;

      xhr.timeout = timeout;
      xhr.ontimeout = reject;
      xhr.withCredentials = true;
      xhr.responseType = "json";

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(data instanceof FormData ? data : JSON.stringify(data));
      }
    });
  }
}
