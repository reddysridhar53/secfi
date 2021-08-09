import axios, { AxiosError, AxiosInstance } from 'axios';
import { logger } from '../logging';
import { BaseApi, RequestConfig, Response, UrlParams } from './types';

export const API_CONFIG: Record<string, any> = {
    returnRejectedPromiseOnError: true,
    withCredentials: false,
    timeout: 60000,
    common: {
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    }
};

/**
 * @param {string, B, R} url, body, response.
 */

class BaseApiService implements BaseApi {
    protected api: AxiosInstance;
    private source: Record<string, any>;

    constructor(config?: RequestConfig) {
        this.api = axios.create(config);
        this.api.interceptors.request.use(this.requestInterceptors.bind(this));
        this.api.interceptors.response.use(this.responseSuccessInterceptors.bind(this), this.responseErrorInterceptors.bind(this));
    }

    request<T, R = Response<T>>(config: RequestConfig): Promise<R> {
        return this.api.request(config);
    }

    async requestInterceptors(config: RequestConfig): Promise<RequestConfig> {
        this.logger(config);
        config.headers = {
            Accept: 'application/json'
        };
        return Promise.resolve(config);
    }

    responseSuccessInterceptors<T>(response: Response<T>) {
        this.logger(response);
        return this.success(response);
    }

    responseErrorInterceptors<T>(error: AxiosError<Error>) {
        return this.error(error);
    }

    get<T, B = UrlParams, R = Response<T>>(url: string, payload?: B, config?: RequestConfig): Promise<R> {
        return this.api.get(url, config);
    }

    delete<T, R = Response<T>>(url: string, config?: RequestConfig): Promise<R> {
        return this.api.delete(url, config);
    }

    post<T, B, R = Response<T>>(url: string, data?: B, config?: RequestConfig): Promise<R> {
        return this.api.post(url, data, config);
    }

    put<T, B, R = Response<T>>(url: string, data?: B, config?: RequestConfig): Promise<R> {
        return this.api.put(url, data, config);
    }

    patch<T, B, R = Response<T>>(url: string, data?: B, config?: RequestConfig): Promise<R> {
        return this.api.patch(url, data, config);
    }

    cancelRequest(requestId: string | number) {
        if (this.source[requestId]) {
            this.source[requestId].cancel('Canceled');
        }
    }

    private success<T>(response: Response<T>): Response<T> {
        return response;
    }

    private error(error: AxiosError<Error>) {
        throw error;
    }

    private logger(msg: any, timeStamp?: Date) {
        timeStamp = timeStamp || new Date();
        logger.debug('BaseApiRequest', `${msg} at ${timeStamp}`);
    }
}

const baseApiService = new BaseApiService(API_CONFIG);

export { baseApiService as request };
