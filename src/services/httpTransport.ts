import { BASE_URL } from '@/constants';
import { IRequestResult } from '@/types';
import { queryStringify } from '@/utils';

const METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

type TMethodKeys = keyof typeof METHOD;
type TMethodValues = (typeof METHOD)[TMethodKeys];
type HTTPMethod = <R = IRequestResult>(url: string, options?: IOptions, timeout?: number) => Promise<R>;

interface IOptions {
    method?: TMethodValues;
    headers?: Record<string, string>;
    data?: FormData | object;
    timeout?: number;
}

const parseXHRResult = (xhr: XMLHttpRequest): IRequestResult => {
    return {
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: xhr.getAllResponseHeaders(),
        data: xhr.responseText,
        json: <T>() => JSON.parse(xhr.responseText) as T,
    };
};

const errorResponse = (xhr: XMLHttpRequest, message: string | null = null): IRequestResult => {
    return {
        ok: false,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: xhr.getAllResponseHeaders(),
        data: message || xhr.statusText,
        json: () => null,
    };
};

export class HTTPTransport {
    private _apiUrl = '';

    constructor(startUrl: string) {
        this._apiUrl = `${BASE_URL}${startUrl}`;
    }

    get: HTTPMethod = (url: string, options: IOptions = {}) => {
        return this.request(`${this._apiUrl}${url}`, { ...options, method: METHOD.GET }, options.timeout);
    };

    post: HTTPMethod = (url: string, options: IOptions = {}) => {
        return this.request(`${this._apiUrl}${url}`, { ...options, method: METHOD.POST }, options.timeout);
    };

    put: HTTPMethod = (url: string, options: IOptions = {}) => {
        return this.request(`${this._apiUrl}${url}`, { ...options, method: METHOD.PUT }, options.timeout);
    };

    delete: HTTPMethod = (url: string, options: IOptions = {}) => {
        return this.request(`${this._apiUrl}${url}`, { ...options, method: METHOD.DELETE }, options.timeout);
    };

    request: HTTPMethod = <IRequestResult>(url: string, options: IOptions = {}, timeout = 5000) => {
        const { headers = {}, method, data } = options;

        return new Promise<IRequestResult>(function (resolve, reject) {
            if (!method) {
                reject('No method');
                return;
            }

            const isGet = method === METHOD.GET;
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.open(method, isGet && !!data ? `${url}${queryStringify(data)}` : url);

            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    resolve(parseXHRResult(xhr) as IRequestResult);
                }
            };

            xhr.onload = () => {
                resolve(parseXHRResult(xhr) as IRequestResult);
            };

            xhr.onabort = () => {
                resolve(errorResponse(xhr, 'Запрос отменен') as IRequestResult);
            };
            xhr.onerror = () => {
                resolve(errorResponse(xhr, 'Ошибка запроса') as IRequestResult);
            };

            xhr.timeout = timeout;
            xhr.ontimeout = () => {
                resolve(errorResponse(xhr, 'Превышено время выполнения запроса') as IRequestResult);
            };

            if (isGet || !data) {
                xhr.send();
            } else if (data instanceof FormData) {
                xhr.send(data);
            } else {
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                xhr.send(JSON.stringify(data));
            }
        });
    };
}
