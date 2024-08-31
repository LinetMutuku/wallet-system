import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, Badge } from '@chakra-ui/react';
import { initializeWallet } from '../redux/actions/walletActions';

const TransactionHistory = () => {
    const transactions = useSelector(state => state.wallet.transactions);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeWallet());
    }, [dispatch]);

    return (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="xl">
            <VStack spacing={6} align="stretch">
                <Heading as="h2" size="xl" textAlign="center">Transaction History</Heading>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Type</Th>
                            <Th>Amount</Th>
                            <Th>Date</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {transactions.map((transaction, index) => (
                            <Tr key={index}>
                                <Td>
                                    <Badge colorScheme={transaction.type === 'deposit' ? 'green' : 'red'}>
                                        {transaction.type}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Text color={transaction.type === 'deposit' ? 'green.500' : 'red.500'} fontWeight="bold">
                                        {transaction.type === 'deposit' ? '+' : '-'}Kshs {transaction.amount.toFixed(2)}
                                    </Text>
                                </Td>
                                <Td>{new Date(transaction.date).toLocaleString()}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </VStack>
        </Box>
    );
};

export default TransactionHistory;