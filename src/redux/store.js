import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Updated to named import
import walletReducer from './reducers/walletReducer';

const rootReducer = combineReducers({
    wallet: walletReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
