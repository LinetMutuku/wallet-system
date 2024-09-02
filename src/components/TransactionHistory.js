import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Text,
    Badge, Alert, AlertIcon, HStack,  IconButton
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const TransactionHistory = () => {
    const { transactions, error } = useSelector(state => state.wallet);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    const nextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    return (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="xl">
            <VStack spacing={6} align="stretch">
                <Heading as="h2" size="lg" textAlign="center">Transaction History</Heading>

                {error && (
                    <Alert status="error">
                        <AlertIcon />
                        {error}
                    </Alert>
                )}

                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Type</Th>
                            <Th>Amount</Th>
                            <Th>Date</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {currentTransactions.map((transaction, index) => (
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

                <HStack justifyContent="center" spacing={4}>
                    <IconButton
                        icon={<ChevronLeftIcon />}
                        onClick={prevPage}
                        isDisabled={currentPage === 1}
                        aria-label="Previous page"
                    />
                    <Text>Page {currentPage} of {totalPages}</Text>
                    <IconButton
                        icon={<ChevronRightIcon />}
                        onClick={nextPage}
                        isDisabled={currentPage === totalPages}
                        aria-label="Next page"
                    />
                </HStack>
            </VStack>
        </Box>
    );
};

export default TransactionHistory;