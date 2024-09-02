import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Header from './components/Header';
import WalletManagement from './components/WalletManagement';
import Dashboard from './pages/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import Login from './components/Login';
import Register from './components/Register';

function App() {
    return (
        <Router>
            <Box minHeight="100vh" bg="gray.50">
                <Header />
                <Box p={4}>
                    <Routes>
                        <Route path="/" element={<WalletManagement/>} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/transactions" element={<TransactionHistory />} />
                    </Routes>
                </Box>
            </Box>
        </Router>
    );
}

export default App;