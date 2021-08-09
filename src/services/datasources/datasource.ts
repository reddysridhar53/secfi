import { BaseApi, RequestConfig, Response, UrlParams } from '../api/types';
import { DatasourceSettings, SupportedTypes } from './types';

export abstract class DatasourceApi<Settings extends DatasourceSettings = DatasourceSettings>{
  name: string;
  type: SupportedTypes;
  proxyUrl: string;

  settings: Settings;
  baseApiService: BaseApi;

  constructor(name: string, type: SupportedTypes, settings: Settings, baseApiService: BaseApi) {
    this.settings = settings;
    this.name = name;
    this.type = type;
    this.proxyUrl = "";
    this.baseApiService = baseApiService;
  }

  getUrl(url: string): string {
    return `${this.proxyUrl}${url}`;
  }

  cancelQuery?<R>(id: string): Promise<R>;
  get?<T, B = UrlParams, R = Response<T>>(url: string, payload?: B, config?: RequestConfig): Promise<R>;
  delete?<T, R = Response<T>>(url: string, config?: RequestConfig): Promise<R>;
  post?<T, B, R = Response<T>>(url: string, data?: B, config?: RequestConfig): Promise<R>;
  put?<T, B, R = Response<T>>(url: string, data?: B, config?: RequestConfig): Promise<R>;
}
