import { ref, push, set, get, onValue, remove } from 'firebase/database';
import { database } from '../../firebase';

// Action Types
export const ADD_FUNDS = 'ADD_FUNDS';
export const WITHDRAW_FUNDS = 'WITHDRAW_FUNDS';
export const MAKE_PURCHASE = 'MAKE_PURCHASE';
export const UPDATE_BALANCE = 'UPDATE_BALANCE';
export const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const DELETE_TRANSACTION = 'DELETE_TRANSACTION';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const SET_ERROR = 'SET_ERROR';
export const SET_LOADING = 'SET_LOADING';

// Action creator for adding funds
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
        const newTransactionRef = await push(transactionsRef, newTransaction);
        newTransaction.id = newTransactionRef.key;

        dispatch({ type: ADD_FUNDS, payload: newTransaction });
        dispatch(updateBalance(newBalance));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

// Action creator for withdrawing funds
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
            const newTransactionRef = await push(transactionsRef, newTransaction);
            newTransaction.id = newTransactionRef.key;

            dispatch({ type: WITHDRAW_FUNDS, payload: newTransaction });
            dispatch(updateBalance(newBalance));
        } else {
            throw new Error('Insufficient funds');
        }
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

// Action creator for making a purchase
export const makePurchase = (amount, itemName) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const balanceRef = ref(database, 'balance');
        const transactionsRef = ref(database, 'transactions');
        const currentBalance = (await get(balanceRef)).val() || 0;

        if (currentBalance >= amount) {
            const newBalance = currentBalance - amount;

            await set(balanceRef, newBalance);
            const newTransaction = {
                type: 'purchase',
                amount: amount,
                item: itemName,
                date: new Date().toISOString(),
            };
            const newTransactionRef = await push(transactionsRef, newTransaction);
            newTransaction.id = newTransactionRef.key;

            dispatch({ type: MAKE_PURCHASE, payload: newTransaction });
            dispatch(updateBalance(newBalance));
        } else {
            throw new Error('Insufficient funds');
        }
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

// Action creator for deleting a transaction
export const deleteTransaction = (transactionId, amount, type) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const balanceRef = ref(database, 'balance');
        const transactionRef = ref(database, `transactions/${transactionId}`);
        const currentBalance = (await get(balanceRef)).val() || 0;

        let newBalance;
        if (type === 'deposit') {
            newBalance = currentBalance - amount;
        } else if (type === 'withdrawal' || type === 'purchase') {
            newBalance = currentBalance + amount;
        } else {
            throw new Error('Invalid transaction type');
        }

        await set(balanceRef, newBalance);
        await remove(transactionRef);

        dispatch({ type: DELETE_TRANSACTION, payload: transactionId });
        dispatch(updateBalance(newBalance));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

// Action creator for updating balance
export const updateBalance = (balance) => ({
    type: UPDATE_BALANCE,
    payload: balance,
});

// Action creator for setting transactions
export const setTransactions = (transactions) => ({
    type: SET_TRANSACTIONS,
    payload: transactions,
});

// Action creator for setting error
export const setError = (error) => ({
    type: SET_ERROR,
    payload: error,
});

// Action creator for setting loading state
export const setLoading = (isLoading) => ({
    type: SET_LOADING,
    payload: isLoading,
});

// Initialize wallet
export const initializeWallet = () => (dispatch) => {
    const balanceRef = ref(database, 'balance');
    const transactionsRef = ref(database, 'transactions');

    onValue(balanceRef, (snapshot) => {
        const balance = snapshot.val() || 0;
        dispatch(updateBalance(balance));
    });

    onValue(transactionsRef, (snapshot) => {
        const transactions = snapshot.val() || {};
        const transactionsArray = Object.entries(transactions).map(([id, transaction]) => ({
            ...transaction,
            id
        }));
        dispatch(setTransactions(transactionsArray));
    });
};