import {
    ADD_FUNDS,
    WITHDRAW_FUNDS,
    UPDATE_BALANCE,
    ADD_TRANSACTION,
} from '../actions/walletActions';

const initialState = {
    balance: 0,
    transactions: [],
};

const walletReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_FUNDS:
            return {
                ...state,
                balance: state.balance + action.payload,
            };
        case WITHDRAW_FUNDS:
            return {
                ...state,
                balance: state.balance - action.payload,
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
        default:
            return state;
    }
};

export default walletReducer;