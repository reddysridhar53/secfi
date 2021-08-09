export const initialState = {
    loading: false,
    exchangeRate: 0,
    error: '',
    amount: ''
};

interface State {
    loading: boolean;
    exchangeRate: string;
    error: string;
    amount: string;
}
export enum ActionType {
    GET_EXCANNGE_RATE,
    GET_EXCANNGE_RATE_SUCCESS,
    GET_EXCANNGE_RATE_ERROR
}
interface Action {
    type: ActionType;
    payload: any;
}

const calculateAmount = (payload: any) => {
    const { rate, amount, target } = payload;
    const amountWithExchange = (amount * parseFloat(rate)).toLocaleString();

    return `${amountWithExchange} ${target}`;
};

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case ActionType.GET_EXCANNGE_RATE:
            return {
                ...state,
                loading: action.payload
            };
        case ActionType.GET_EXCANNGE_RATE_SUCCESS:
            return {
                ...state,
                loading: false,
                exchangeRate: action.payload?.rate,
                amount: calculateAmount(action.payload)
            };
        case ActionType.GET_EXCANNGE_RATE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload?.error
            };
        default:
            return { ...state };
    }
};

export default reducer;
