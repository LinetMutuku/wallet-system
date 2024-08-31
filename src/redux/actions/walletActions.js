import { ref, push, set, get, onValue } from 'firebase/database';
import { database } from '../../firebase';

export const ADD_FUNDS = 'ADD_FUNDS';
export const WITHDRAW_FUNDS = 'WITHDRAW_FUNDS';
export const UPDATE_BALANCE = 'UPDATE_BALANCE';
export const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const SET_ERROR = 'SET_ERROR';

// Add funds action
export const addFunds = (amount) => async (dispatch) => {
    try {
        const balanceRef = ref(database, 'balance');
        const transactionsRef = ref(database, 'transactions');
        const currentBalance = (await get(balanceRef)).val() || 0;
        const newBalance = currentBalance + amount;

        // Update the balance and add the transaction
        await set(balanceRef, newBalance);
        await push(transactionsRef, {
            type: 'deposit',
            amount: amount,
            date: new Date().toISOString(),
        });

        // Dispatch the actions
        dispatch({ type: ADD_FUNDS, payload: amount });
        dispatch(updateBalance(newBalance));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

// Withdraw funds action
export const withdrawFunds = (amount) => async (dispatch) => {
    try {
        const balanceRef = ref(database, 'balance');
        const transactionsRef = ref(database, 'transactions');
        const currentBalance = (await get(balanceRef)).val() || 0;

        if (currentBalance >= amount) {
            const newBalance = currentBalance - amount;

            // Update the balance and add the transaction
            await set(balanceRef, newBalance);
            await push(transactionsRef, {
                type: 'withdrawal',
                amount: amount,
                date: new Date().toISOString(),
            });

            // Dispatch the actions
            dispatch({ type: WITHDRAW_FUNDS, payload: amount });
            dispatch(updateBalance(newBalance));
        } else {
            throw new Error('Insufficient funds');
        }
    } catch (error) {
        dispatch(setError(error.message));
    }
};

// Update balance action
export const updateBalance = (balance) => ({
    type: UPDATE_BALANCE,
    payload: balance,
});

// Add transaction action
export const addTransaction = (transaction) => ({
    type: ADD_TRANSACTION,
    payload: transaction,
});

// Set transactions action
export const setTransactions = (transactions) => ({
    type: SET_TRANSACTIONS,
    payload: transactions,
});

// Set error action
export const setError = (error) => ({
    type: SET_ERROR,
    payload: error,
});

// Initialize wallet action
export const initializeWallet = () => (dispatch) => {
    const balanceRef = ref(database, 'balance');
    const transactionsRef = ref(database, 'transactions');

    // Fetch balance data
    onValue(balanceRef, (snapshot) => {
        const balance = snapshot.val() || 0;
        dispatch(updateBalance(balance));
    });

    // Fetch transaction data
    onValue(transactionsRef, (snapshot) => {
        const transactions = snapshot.val() || {};
        dispatch(setTransactions(Object.values(transactions)));
    });
};
