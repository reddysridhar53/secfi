export type StateProps = {
    isLoading: boolean;
};

export type Props = StateProps;

export type CurrencyOption = {
    label: string;
    name?: string;
    value: string;
};

export type ExchangeForm = {
    base: string;
    target: string;
    amount: number;
};
