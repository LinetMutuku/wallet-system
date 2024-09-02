import { ref, push, set, get, onValue } from 'firebase/database';
import { database } from '../../firebase';

export const ADD_FUNDS = 'ADD_FUNDS';
export const WITHDRAW_FUNDS = 'WITHDRAW_FUNDS';
export const UPDATE_BALANCE = 'UPDATE_BALANCE';
export const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const SET_ERROR = 'SET_ERROR';
export const SET_LOADING = 'SET_LOADING';

export const addFunds = (amount) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const balanceRef = ref(database, 'balance');
        const transactionsRef = ref(database, 'transactions');
        const currentBalance = (await get(balanceRef)).val() || 0;
        const newBalance = currentBalance + amount;

        await set(balanceRef, newBalance);
        const newTransaction = {
            type: 'deposit',
            amount: amount,
            date: new Date().toISOString(),
        };
        await push(transactionsRef, newTransaction);

        dispatch({ type: ADD_FUNDS, payload: amount });
        dispatch(updateBalance(newBalance));
        dispatch(addTransaction(newTransaction));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const withdrawFunds = (amount) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const balanceRef = ref(database, 'balance');
        const transactionsRef = ref(database, 'transactions');
        const currentBalance = (await get(balanceRef)).val() || 0;

        if (currentBalance >= amount) {
            const newBalance = currentBalance - amount;

            await set(balanceRef, newBalance);
            const newTransaction = {
                type: 'withdrawal',
                amount: amount,
                date: new Date().toISOString(),
            };
            await push(transactionsRef, newTransaction);

            dispatch({ type: WITHDRAW_FUNDS, payload: amount });
            dispatch(updateBalance(newBalance));
            dispatch(addTransaction(newTransaction));
        } else {
            throw new Error('Insufficient funds');
        }
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const updateBalance = (balance) => ({
    type: UPDATE_BALANCE,
    payload: balance,
});

export const addTransaction = (transaction) => ({
    type: ADD_TRANSACTION,
    payload: transaction,
});

export const setTransactions = (transactions) => ({
    type: SET_TRANSACTIONS,
    payload: transactions,
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: error,
});

export const setLoading = (isLoading) => ({
    type: SET_LOADING,
    payload: isLoading,
});

export const initializeWallet = () => (dispatch) => {
    const balanceRef = ref(database, 'balance');
    const transactionsRef = ref(database, 'transactions');

    onValue(balanceRef, (snapshot) => {
        const balance = snapshot.val() || 0;
        dispatch(updateBalance(balance));
    });

    onValue(transactionsRef, (snapshot) => {
        const transactions = snapshot.val() || {};
        dispatch(setTransactions(Object.values(transactions)));
    });
};