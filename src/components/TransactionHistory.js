import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Text,
    Badge, Alert, AlertIcon, Skeleton, useColorModeValue
} from '@chakra-ui/react';
import { initializeWallet } from '../redux/actions/walletActions';

const TransactionHistory = () => {
    const { transactions, error, loading } = useSelector(state => state.wallet);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeWallet());
    }, [dispatch]);

    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.200');

    return (
        <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="xl">
            <VStack spacing={6} align="stretch">
                <Heading as="h2" size="xl" textAlign="center">Transaction History</Heading>

                {error && (
                    <Alert status="error">
                        <AlertIcon />
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <VStack spacing={4}>
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} height="40px" width="100%" />
                        ))}
                    </VStack>
                ) : (
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
                                    <Td>
                                        <Text color={textColor}>
                                            {new Date(transaction.date).toLocaleString()}
                                        </Text>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </VStack>
        </Box>
    );
};

export default TransactionHistory;