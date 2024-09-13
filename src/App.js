import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import WalletManagement from './components/WalletManagement';
import Dashboard from './pages/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import Login from './components/Login';
import Register from './components/Register';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Box minHeight="100vh" bg="gray.50">
                    <Header />
                    <Box p={4}>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/" element={<ProtectedRoute><WalletManagement /></ProtectedRoute>} />
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/transactions" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
                        </Routes>
                    </Box>
                </Box>
            </Router>
        </AuthProvider>
    );
}

export default App;