import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { setLoginTimestamp, checkSessionValidity, clearSession } from '../utils/sessionUtil';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && checkSessionValidity()) {
                setCurrentUser(user);
                setLoginTimestamp();
            } else {
                setCurrentUser(null);
                clearSession();
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        const result = await auth.signInWithEmailAndPassword(email, password);
        setLoginTimestamp();
        return result;
    };

    const logout = () => {
        clearSession();
        return signOut(auth);
    };

    const value = {
        currentUser,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}