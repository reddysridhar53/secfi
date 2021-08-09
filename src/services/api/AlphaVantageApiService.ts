import axios, { CancelTokenSource } from 'axios';
import datasourceApiManager from 'services/datasources/datasource-api';
import { v4 as uuid } from 'uuid';
import { ExchageRateResponse, ExchangeRatePayload, RequestConfig } from './types';

const EXCHANGE_FUNCTION = 'CURRENCY_EXCHANGE_RATE';
const DAILY_FUNCTION = 'FX_DAILY';
const API_KEY = 'Z2ZYTNZSRT79OFRC';

class AlphaVantageApi {
    protected source: string = 'alphaVantage';

    private getCancelTokenSource(): CancelTokenSource {
        const cancelTokenSource = axios.CancelToken.source();
        // eslint-disable-next-line
        cancelTokenSource.token.throwIfRequested = cancelTokenSource.token.throwIfRequested;
        return cancelTokenSource;
    }

    getUUId(): string {
        return uuid();
    }

    private cancelTokenSourceMap: Map<string, CancelTokenSource> = new Map();

    private getFxDailyUrl(payload: ExchangeRatePayload) {
        // return '?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=demo';
        return `?function=${DAILY_FUNCTION}&from_symbol=${payload.base}&to_symbol=${payload.target}&apikey=${API_KEY}&outputsize=full`;
    }

    private getExchangeUrl(payload: ExchangeRatePayload) {
        return `?function=${EXCHANGE_FUNCTION}&from_currency=${payload.base}&to_currency=${payload.target}&apikey=${API_KEY}`;
    }

    getExachangeRate(payload: ExchangeRatePayload, isDaily?: boolean, uuId?: string): Promise<ExchageRateResponse> {
        const url = isDaily ? this.getFxDailyUrl(payload) : this.getExchangeUrl(payload);
        let options: RequestConfig;

        if (uuId) {
            const cancelTokenSource = this.getCancelTokenSource();

            options.requestId = uuId;
            options.cancelToken = cancelTokenSource.token;
            this.cancelTokenSourceMap.set(uuId, cancelTokenSource);
        }
        return datasourceApiManager
            .get(this.source)
            .get(url, payload, options)
            .then(res => {
                const { requestId } = JSON.parse(res?.config?.data || '{}');

                if (requestId && this.cancelTokenSourceMap.has(requestId)) {
                    this.cancelTokenSourceMap.delete(requestId);
                }
                return res.data;
            });
    }

    cancelRequest(uuId: string) {
        if (this.cancelTokenSourceMap.has(uuId)) {
            const cancelTokenSource = this.cancelTokenSourceMap.get(uuId);

            cancelTokenSource.cancel(`cancelled`);
            this.cancelTokenSourceMap.delete(uuId);
        }
    }
}

const alphaVatageInstance = new AlphaVantageApi();

export { alphaVatageInstance as alphaVantageApi };
