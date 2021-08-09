import Block from '@components/block';
import TextInput from '@components/input';
import Label from '@components/label';
import { PageContent } from '@components/layout';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useMemo, useReducer, useRef, useState } from 'react';
import Select, { ActionMeta } from 'react-select';
import { currencies } from '../../currencies';
import { alphaVantageApi } from '../../services/api';
import Chart from './copmponents/Chart';
import reducer, { ActionType, initialState } from './reducer';
import { Header } from './styled-elemets';
import { CurrencyOption, ExchangeForm, Props } from './types';

const selectors = [
    {
        name: 'base',
        label: 'From Currency'
    },
    {
        name: 'target',
        label: 'To Currency'
    }
];
const MAX_PREVIOUS_DAYS = 30;

export const Home: React.FC<Props> = ({ isLoading }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [form, setForm] = useState<ExchangeForm>();
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [allHistoricRates, setAllHistoricRates] = useState<any>({});
    const [historicError, setHistoricError] = useState<string>('');
    const [loadingHistoric, setLoadingHistoric] = useState<boolean>(false);
    const { loading, amount: fAmount, exchangeRate, error } = state;
    let maxHistoricRates = useRef<number>(-1);

    const calculateExchangeRate = useCallback(
        async () => {
            const { base, target, amount } = form || {};
            try {
                const exchangeRate = await alphaVantageApi.getExachangeRate({
                    base: base,
                    target: target
                }) as unknown as any;
                if (exchangeRate["Error Message"]) {
                    dispatch({
                        type: ActionType.GET_EXCANNGE_RATE_ERROR,
                        payload: {
                            error: exchangeRate["Error Message"]
                        }
                    })
                    return;
                }
                const rate = exchangeRate?.['Realtime Currency Exchange Rate']?.['5. Exchange Rate'];

                dispatch({
                    type: ActionType.GET_EXCANNGE_RATE_SUCCESS,
                    payload: {
                        rate,
                        amount,
                        target,
                    }
                })
            } catch (error: any) {
                dispatch({
                    type: ActionType.GET_EXCANNGE_RATE_ERROR,
                    payload: {
                        error: error?.message
                    }
                })
            }
    }, [form]);

    const getHistoricExchangeRates = useCallback(
        async() => {
            const { base, target } = form || {};
            try {
                if (!isEmpty(allHistoricRates)) {
                    return;
                }
                setLoadingHistoric(true)
                const exchangeRates = await alphaVantageApi.getExachangeRate({
                    base: base,
                    target: target
                }, true) as unknown as any;
                setLoadingHistoric(false);
                if (exchangeRates["Error Message"]) {
                    setHistoricError(exchangeRates["Error Message"]);
                    return;
                }
                const rates = exchangeRates?.['Time Series FX (Daily)'];
                maxHistoricRates.current = Object.keys(rates).length
                setAllHistoricRates(rates || []);
                
            } catch (error: any) {
                setHistoricError(error?.message);
                setLoadingHistoric(false);
            }
        },
    [form]);

    const getExchangeData = useCallback(() => {
        const { base, target, amount } = form || {};

        if (base && target && amount) {
            dispatch({
                type: ActionType.GET_EXCANNGE_RATE,
                payload: true
            })
            calculateExchangeRate();
            getHistoricExchangeRates();
            return;
        }
        dispatch({
            type: ActionType.GET_EXCANNGE_RATE_ERROR,
            payload: {
                error: 'Please enter all Fields'
            }
        });
    }, [calculateExchangeRate, getHistoricExchangeRates]);

    const handleAmountChange = useCallback(
        (params: string) => {
            if (isNaN(params as unknown as number)) {
                return;
            }
            setForm({
                ...form,
                amount: parseInt(params, 10),
            })
    }, [form]);

    const hanndleCurrencyChange = useCallback(
        (option: CurrencyOption, meta: ActionMeta<CurrencyOption>) => {
            const { name } = meta;
            const { value } = option;

            setForm(form => ({
                ...form,
                [name]: value,
            }));
    }, [form]);

    const currencyOptions = useMemo(() => currencies.map((currency) => ({
                label: `${currency.symbol} (${currency.name})`,
                name: currency.name,
                value: currency.symbol
            })
    ), []);

    const historicRates = useMemo(() => {
        if (allHistoricRates) {
            const dates = Object.keys(allHistoricRates);
            const fDates: string[] = [];
            const currentDate = moment().subtract(currentPage * 30, 'days').valueOf();
            const lastDate = moment().subtract((currentPage + 1) * 30, 'days').valueOf();
           
            dates.forEach((date) => {
                const lDate = new Date(date);
                if (lDate.getTime() <= currentDate && lDate.getTime() >= lastDate) {
                    fDates.push(date);
                }
            })
            const rates = dates.slice(currentPage * MAX_PREVIOUS_DAYS, currentPage * MAX_PREVIOUS_DAYS + MAX_PREVIOUS_DAYS);
            return fDates;
        }
        return [];
    }, [allHistoricRates, currentPage])

    const prevDates = useMemo(() => {
        return {
            previous: moment().subtract(currentPage * 30, 'days'),
            previousLast: moment().subtract((currentPage + 1) * 30, 'days'),
        }
    }, [currentPage]); 

    const style = {
        flex: 1,
        minHeight: '400px'
    };
    const enable = form?.base && form?.target && form?.amount;

    return (
        <PageContent isLoading={isLoading}>
            <Header main>
                Exchange Rates
            </Header>
            <div className={'actions-container'}>
                {
                    selectors.map((selector) => {
                        return (
                            <Block key={selector.name} flex={1} col>
                                <Label name={selector.name} label={selector.label} />
                                <Select
                                    className="basic-single-select"
                                    classNamePrefix="select"
                                    placeholder="Start typing..."
                                    isLoading={isLoading}
                                    isClearable={true}
                                    isSearchable={true}
                                    name={selector.name}
                                    onChange={hanndleCurrencyChange}
                                    options={currencyOptions}
                                />
                            </Block>
                        )
                    })
                }
                <Block flex={1} col>
                    <TextInput 
                        placeHolder={'Enter Amount'}
                        label={'Amount'}
                        name={'amount'}
                        onChange={handleAmountChange}
                        type={'number'}
                        onEnter={getExchangeData}
                    />
                </Block>
                <button onClick={getExchangeData} className={enable ? 'active' : 'disabled'}>convert</button>
            </div>
            <div className="results-container">
                {
                    loading && <div className="exchange-rate-loading">
                        coverting...
                    </div>
                }
                {
                    !loading && !error && fAmount && exchangeRate && (
                        <div className="exchange-amount-wrapper">
                            <div className="exchange-amount-text">
                                Amount: <span>{fAmount}</span>
                            </div>
                            <div className="echange-amount-rate-text">
                                Exchange Rate: <span>{exchangeRate}</span>&nbsp;&nbsp;<i>{`(1 ${form.base} = ${exchangeRate} ${form.target})`}</i>
                            </div>
                        </div>
                    )
                }
                {
                    !loading && error && <div className="exchange-rate-error">
                        {error}
                    </div>
                }
            </div>
            <>
                { (enable || historicError) && <h2 className="exchange-rate-chart-main-header">Historic Exchange Rates</h2> }
                {
                    loadingHistoric && (
                        <>
                            <div>loading historic exchange rates...</div>
                        </>
                    )
                }
                {
                    !loadingHistoric && !historicError && enable && !isEmpty(allHistoricRates) && (
                        <div className="exchange-rate-chart">
                            <div className="exchange-rate-chart-header">
                                <p className="exchange-rate-chart-header-text">
                                    Exchange Rate {currentPage === 0 ? ' (last 30 days)' : ` (${prevDates?.previous.format('DD-MM-YYYY')} - ${prevDates?.previousLast.format('DD-MM-YYYY')})`}
                                </p>
                                <div className="exchange-rate-chart-actions">
                                    <button className={ historicRates.length < 5 ? 'disabled' : '' } onClick={() => setCurrentPage(curr => curr + 1)}>previous</button>
                                    <button className={ currentPage === 0 ? 'disabled' : '' } onClick={() => setCurrentPage(curr => curr > 0 ? curr - 1 : curr)}>next</button>
                                </div>
                            </div>
                            <div className="exchange-rate-graph" style={style}>
                                <Chart
                                    data={allHistoricRates}
                                    dataToShow={historicRates}
                                    containerElemClass={'exchange-rate-graph'}
                                    loading={loadingHistoric}
                                />
                            </div>
                        </div>
                    )
                }
                {
                    !loadingHistoric && historicError && (
                        <div className="exchange-rate-error">
                            {historicError}
                        </div>
                    )
                }
            </>
        </PageContent>
    )
};
