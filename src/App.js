import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { checkSessionValidity } from './utils/sessionUtil';
import Header from './components/Header';
import WalletManagement from './components/WalletManagement';
import Dashboard from './pages/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import Login from './components/Login';
import Register from './components/Register';

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/login" />;
};

function AppContent() {
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!checkSessionValidity() && currentUser) {
            // Redirect to login if session is invalid
            window.location.href = '/login';
        }
    }, [currentUser]);

    return (
        <Router>
            <Box minHeight="100vh" bg="gray.50">
                <Header />
                <Box p={4}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <WalletManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/transactions"
                            element={
                                <ProtectedRoute>
                                    <TransactionHistory />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Box>
            </Box>
        </Router>
    );
}

function App() {
    return (
        <ChakraProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ChakraProvider>
    );
}

export default App;