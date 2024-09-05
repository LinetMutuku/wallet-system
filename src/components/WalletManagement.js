import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, Grid, GridItem, VStack, Heading, Button, Input, useToast, HStack,
    Stat, StatLabel, StatNumber, StatHelpText, StatArrow,
    CircularProgress, CircularProgressLabel, Text
} from '@chakra-ui/react';
import { addFunds, withdrawFunds, initializeWallet } from '../redux/actions/walletActions';
import TransactionHistory from './TransactionHistory';
import PurchaseIntegration from './PurchaseIntegration';

const WalletManagement = () => {
    const [amount, setAmount] = useState('');
    const balance = useSelector(state => state.wallet.balance);
    const dispatch = useDispatch();
    const toast = useToast();

    useEffect(() => {
        dispatch(initializeWallet());
    }, [dispatch]);

    const handleAddFunds = () => {
        if (amount && Number(amount) > 0) {
            dispatch(addFunds(Number(amount)))
                .then(() => {
                    setAmount('');
                    toast({
                        title: 'Funds added successfully',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                    });
                })
                .catch(error => {
                    toast({
                        title: 'Error adding funds',
                        description: error.message,
                        status: 'error',
                        duration: 2000,
                        isClosable: true,
                    });
                });
        }
    };

    const handleWithdrawFunds = () => {
        if (amount && Number(amount) > 0) {
            dispatch(withdrawFunds(Number(amount)))
                .then(() => {
                    setAmount('');
                    toast({
                        title: 'Funds withdrawn successfully',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                    });
                })
                .catch(error => {
                    toast({
                        title: 'Error withdrawing funds',
                        description: error.message,
                        status: 'error',
                        duration: 2000,
                        isClosable: true,
                    });
                });
        }
    };

    const maxBalance = 10000; // Example max balance
    const numericBalance = Number(balance) || 0; // Ensure balance is a number
    const percentage = (numericBalance / maxBalance) * 100;

    return (
        <Box>
            <Heading as="h2" size="xl" mb={6}>Wallet Management</Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem colSpan={2}>
                    <Box bg="white" p={6} borderRadius="lg" boxShadow="xl">
                        <VStack spacing={8} align="stretch">
                            <HStack spacing={8} justify="center">
                                <CircularProgress value={percentage} size="120px" thickness="8px" color="green.400">
                                    <CircularProgressLabel>
                                        <VStack spacing={0}>
                                            <Text fontSize="sm">Balance</Text>
                                            <Text fontSize="xl" fontWeight="bold">Kshs {numericBalance.toFixed(2)}</Text>
                                        </VStack>
                                    </CircularProgressLabel>
                                </CircularProgress>
                                <Stat>
                                    <StatLabel fontSize="xl">Current Balance</StatLabel>
                                    <StatNumber fontSize="4xl">Kshs {numericBalance.toFixed(2)}</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type={numericBalance > 0 ? 'increase' : 'decrease'} />
                                        {numericBalance > 0 ? 'Positive' : 'Negative'} balance
                                    </StatHelpText>
                                </Stat>
                            </HStack>
                            <Input
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                type="number"
                                size="lg"
                            />
                            <HStack spacing={4}>
                                <Button colorScheme="teal" onClick={handleAddFunds} size="lg" flex={1}>Add Funds</Button>
                                <Button colorScheme="orange" onClick={handleWithdrawFunds} size="lg" flex={1}>Withdraw Funds</Button>
                            </HStack>
                        </VStack>
                    </Box>
                </GridItem>
                <GridItem colSpan={1}>
                    <PurchaseIntegration />
                </GridItem>
                <GridItem colSpan={1}>
                    <TransactionHistory />
                </GridItem>
            </Grid>
        </Box>
    );
};

export default WalletManagement;
