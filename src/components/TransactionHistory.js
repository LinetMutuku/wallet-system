import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Text,
    Badge, Alert, AlertIcon, HStack, IconButton, Select, Input,
    Flex, Spacer, Button, useDisclosure, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Stat, StatLabel, StatNumber, useToast, AlertDialog, AlertDialogBody,
    AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, RepeatIcon, DeleteIcon } from '@chakra-ui/icons';
import { setError, withdrawFunds, addFunds, makePurchase, deleteTransaction, initializeWallet } from '../redux/actions/walletActions';

const TransactionHistory = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    const { transactions, error, balance, loading } = useSelector(state => state.wallet);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const cancelRef = React.useRef();

    useEffect(() => {
        dispatch(initializeWallet());
    }, [dispatch]);

    // ... (keep all the existing code here, including filteredAndSortedTransactions,
    // pagination logic, sorting logic, etc.)

    const openDeleteConfirmDialog = (transaction) => {
        setTransactionToDelete(transaction);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteConfirmDialog = () => {
        setIsDeleteDialogOpen(false);
        setTransactionToDelete(null);
    };

    const confirmDelete = () => {
        if (transactionToDelete) {
            dispatch(deleteTransaction(transactionToDelete.id, transactionToDelete.amount, transactionToDelete.type))
                .then(() => {
                    toast({
                        title: "Transaction deleted",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                    closeDeleteConfirmDialog();
                })
                .catch(error => {
                    dispatch(setError(error.message));
                    toast({
                        title: "Error deleting transaction",
                        description: error.message,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                    closeDeleteConfirmDialog();
                });
        }
    };

    // ... (keep all the existing code here, including the rest of the component logic)

    return (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="xl">
            {/* ... (keep all the existing JSX here) */}

            <Table variant="simple">
                <Thead>
                    {/* ... (keep the existing table header) */}
                </Thead>
                <Tbody>
                    {currentTransactions.map((transaction) => (
                        <Tr key={transaction.id}>
                            {/* ... (keep the existing table cells) */}
                            <Td>
                                <Button size="sm" onClick={() => openTransactionDetails(transaction)} mr={2}>
                                    Details
                                </Button>
                                <IconButton
                                    icon={<RepeatIcon />}
                                    size="sm"
                                    onClick={() => handleRecurringTransaction(transaction)}
                                    aria-label="Repeat transaction"
                                    mr={2}
                                />
                                <IconButton
                                    icon={<DeleteIcon />}
                                    size="sm"
                                    colorScheme="red"
                                    onClick={() => openDeleteConfirmDialog(transaction)}
                                    aria-label="Delete transaction"
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            {/* ... (keep all the existing JSX here, including pagination, modals, etc.) */}

            <AlertDialog
                isOpen={isDeleteDialogOpen}
                leastDestructiveRef={cancelRef}
                onClose={closeDeleteConfirmDialog}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Transaction
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this transaction? This action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={closeDeleteConfirmDialog}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default TransactionHistory;