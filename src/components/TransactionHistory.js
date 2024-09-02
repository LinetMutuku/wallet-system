import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Text,
    Badge, Alert, AlertIcon, HStack, IconButton, Select, Input,
    Flex, Spacer, Button, useDisclosure, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Stat, StatLabel, StatNumber, useToast
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, RepeatIcon } from '@chakra-ui/icons';
import { addTransaction, setError, withdrawFunds, addFunds } from '../redux/actions/walletActions';

const TransactionHistory = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    const { transactions, error, balance } = useSelector(state => state.wallet);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Filtered and sorted transactions
    const filteredAndSortedTransactions = useMemo(() => {
        return transactions
            .filter(transaction =>
                (transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    transaction.amount.toString().includes(searchTerm) ||
                    new Date(transaction.date).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())) &&
                (!dateRange.start || new Date(transaction.date) >= new Date(dateRange.start)) &&
                (!dateRange.end || new Date(transaction.date) <= new Date(dateRange.end))
            )
            .sort((a, b) => {
                if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
                if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
    }, [transactions, searchTerm, sortField, sortOrder, dateRange]);

    const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = filteredAndSortedTransactions.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    };

    const openTransactionDetails = (transaction) => {
        setSelectedTransaction(transaction);
        onOpen();
    };

    const handleRecurringTransaction = (transaction) => {
        const recurringTransaction = {
            ...transaction,
            date: new Date().toISOString(),
        };
        if (transaction.type === 'deposit') {
            dispatch(addFunds(transaction.amount))
                .then(() => {
                    toast({
                        title: "Recurring deposit added",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                })
                .catch(error => {
                    dispatch(setError(error.message));
                    toast({
                        title: "Error adding recurring deposit",
                        description: error.message,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                });
        } else {
            dispatch(withdrawFunds(transaction.amount))
                .then(() => {
                    toast({
                        title: "Recurring withdrawal added",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                })
                .catch(error => {
                    dispatch(setError(error.message));
                    toast({
                        title: "Error adding recurring withdrawal",
                        description: error.message,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                });
        }
    };

    // Calculate statistics
    const stats = useMemo(() => {
        return filteredAndSortedTransactions.reduce((acc, transaction) => {
            if (transaction.type === 'deposit') {
                acc.totalDeposits += transaction.amount;
            } else {
                acc.totalWithdrawals += transaction.amount;
            }
            return acc;
        }, { totalDeposits: 0, totalWithdrawals: 0 });
    }, [filteredAndSortedTransactions]);

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

                <Flex>
                    <Input
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        width="300px"
                        mr={4}
                    />
                    <Input
                        type="date"
                        placeholder="Start Date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        mr={2}
                    />
                    <Input
                        type="date"
                        placeholder="End Date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        mr={2}
                    />
                    <Select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        width="150px"
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                    </Select>
                    <Spacer />
                </Flex>

                <VStack spacing={4} align="stretch">
                    <Stat>
                        <StatLabel>Current Balance</StatLabel>
                        <StatNumber color={balance >= 0 ? "green.500" : "red.500"}>
                            Kshs {balance.toFixed(2)}
                        </StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Total Deposits</StatLabel>
                        <StatNumber color="green.500">Kshs {stats.totalDeposits.toFixed(2)}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Total Withdrawals</StatLabel>
                        <StatNumber color="red.500">Kshs {stats.totalWithdrawals.toFixed(2)}</StatNumber>
                    </Stat>
                </VStack>

                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th cursor="pointer" onClick={() => handleSort('type')}>
                                Type {sortField === 'type' && (sortOrder === 'asc' ? '▲' : '▼')}
                            </Th>
                            <Th cursor="pointer" onClick={() => handleSort('amount')}>
                                Amount {sortField === 'amount' && (sortOrder === 'asc' ? '▲' : '▼')}
                            </Th>
                            <Th cursor="pointer" onClick={() => handleSort('date')}>
                                Date {sortField === 'date' && (sortOrder === 'asc' ? '▲' : '▼')}
                            </Th>
                            <Th>Actions</Th>
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
                                <Td>
                                    <Button size="sm" onClick={() => openTransactionDetails(transaction)} mr={2}>
                                        Details
                                    </Button>
                                    <IconButton
                                        icon={<RepeatIcon />}
                                        size="sm"
                                        onClick={() => handleRecurringTransaction(transaction)}
                                        aria-label="Repeat transaction"
                                    />
                                </Td>
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

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Transaction Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedTransaction && (
                            <VStack align="stretch" spacing={4}>
                                <Text><strong>Type:</strong> {selectedTransaction.type}</Text>
                                <Text><strong>Amount:</strong> Kshs {selectedTransaction.amount.toFixed(2)}</Text>
                                <Text><strong>Date:</strong> {new Date(selectedTransaction.date).toLocaleString()}</Text>
                            </VStack>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default TransactionHistory;