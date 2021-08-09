import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export enum LoadingState {
    NotStarted = 'NotStarted',
    Loading = 'Loading',
    Streaming = 'Streaming',
    Done = 'Done',
    Error = 'Error'
}

export interface RequestConfig extends AxiosRequestConfig {
    camelizeResponse?: boolean;
    requestId?: string | number;
}

export type UrlParams = Record<string, number | string>;

export interface Response<T> extends AxiosResponse<T> {
    config: RequestConfig;
}

export interface Error extends AxiosError {}

export interface BaseApi {
    requestInterceptors?: (config: RequestConfig) => Promise<RequestConfig>;
    request?<T, R = Response<T>>(config: RequestConfig): Promise<R>;
    get?<T, B = UrlParams, R = Response<T>>(url: string, payload?: B, config?: RequestConfig): Promise<R>;
    delete?<T, R = Response<T>>(url: string, config?: RequestConfig): Promise<R>;
    post?<T, B, R = Response<T>>(url: string, data?: B, config?: RequestConfig): Promise<R>;
    put?<T, B, R = Response<T>>(url: string, data?: B, config?: RequestConfig): Promise<R>;
    cancelRequest?: (id: string) => void;
}

export interface ExchageRateResponse {
    // Realtime Currency Exchange Rate: {
    //     1. From_Currency Code: "USD",
    //     2. From_Currency Name: "United States Dollar",
    //     3. To_Currency Code: "JPY",
    //     4. To_Currency Name: "Japanese Yen",
    //     5. Exchange Rate: "110.23300000",
    //     6. Last Refreshed: "2021-08-07 12:48:01",
    //     7. Time Zone: "UTC",
    //     8. Bid Price: "110.22840000",
    //     9. Ask Price: "110.23320000"
    //     }
}

export interface ExchangeRatePayload {
    base: string;
    target: string;
    amount?: number;
}
