import {
    ADD_FUNDS,
    WITHDRAW_FUNDS,
    MAKE_PURCHASE,
    UPDATE_BALANCE,
    ADD_TRANSACTION,
    DELETE_TRANSACTION,
    SET_TRANSACTIONS,
    SET_ERROR,
    SET_LOADING
} from '../actions/walletActions';

const initialState = {
    balance: 0,
    transactions: [],
    error: null,
    loading: false,
};

const walletReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_FUNDS:
            return {
                ...state,
                balance: state.balance + action.payload,
            };
        case WITHDRAW_FUNDS:
        case MAKE_PURCHASE:
            return {
                ...state,
                balance: state.balance - action.payload.amount,
            };
        case UPDATE_BALANCE:
            return {
                ...state,
                balance: action.payload,
            };
        case ADD_TRANSACTION:
            return {
                ...state,
                transactions: [action.payload, ...state.transactions],
            };
        case DELETE_TRANSACTION:
            return {
                ...state,
                transactions: state.transactions.filter(transaction => transaction.id !== action.payload),
            };
        case SET_TRANSACTIONS:
            return {
                ...state,
                transactions: action.payload,
            };
        case SET_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        case SET_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
};

export default walletReducer;