import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Heading, VStack, useColorModeValue } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WalletGraphs = () => {
    const transactions = useSelector(state => state.wallet.transactions);

    const graphData = useMemo(() => {
        const data = { deposits: 0, withdrawals: 0, purchases: 0 };
        transactions.forEach(transaction => {
            if (transaction.type === 'deposit') {
                data.deposits += transaction.amount;
            } else if (transaction.type === 'withdrawal') {
                data.withdrawals += transaction.amount;
            } else if (transaction.type === 'purchase') {
                data.purchases += transaction.amount;
            }
        });
        return [
            { name: 'Deposits', amount: data.deposits },
            { name: 'Withdrawals', amount: data.withdrawals },
            { name: 'Purchases', amount: data.purchases },
        ];
    }, [transactions]);

    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.800', 'white');

    return (
        <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="xl">
            <VStack spacing={6} align="stretch">
                <Heading as="h2" size="lg" textAlign="center" color={textColor}>
                    Wallet Activity
                </Heading>
                <Box height="300px">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={graphData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </VStack>
        </Box>
    );
};

export default WalletGraphs;