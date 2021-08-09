import { config } from '../../../app.cofig';
import { BaseApi, RequestConfig, Response } from '../../api/types';
import { DatasourceApi } from '../datasource';
import { DatasourceSettings } from '../types';

export interface AlphaVantageSettings extends DatasourceSettings {
    proxyUrl?: string;
}

export class AlphaVantageDatasource extends DatasourceApi {
    constructor(name: string, settings: AlphaVantageSettings, baseService: BaseApi) {
        super(name, 'alphaVantage', settings, baseService);
    }

    getUrl(url?: string) {
        return `${config.aplhaVatageUrl}${url}`;
    }

    get<T, B, R = Response<T>>(url: string, payload: B, config?: RequestConfig): Promise<R> {
        const dsUrl = this.getUrl(url);
        return this.baseApiService.get(dsUrl, payload, config);
    }

    post<T, B, R = Response<T>>(url: string, data?: B, config?: RequestConfig): Promise<R> {
        const dsUrl = this.getUrl(url);
        return this.baseApiService.post(dsUrl, data, config);
    }

    delete<T, R = Response<T>>(url: string, config?: RequestConfig): Promise<R> {
        const dsUrl = this.getUrl(url);
        return this.baseApiService.delete(dsUrl, config);
    }

    put<T, B, R = Response<T>>(url: string, data?: B, config?: RequestConfig): Promise<R> {
        const dsUrl = this.getUrl(url);
        return this.baseApiService.put(dsUrl, data, config);
    }
}
